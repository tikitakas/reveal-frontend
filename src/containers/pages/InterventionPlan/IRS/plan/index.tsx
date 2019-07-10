// this is the IRS Plan page component
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Store } from 'redux';

import reducerRegistry from '@onaio/redux-reducer-registry';
import superset from '@onaio/superset-connector';
// import DrillDownTable from '@onaio/drill-down-table';

import {
  SUPERSET_JURISDICTIONS_SLICE,
  SUPERSET_PLAN_STRUCTURE_PIVOT_SLICE,
  SUPERSET_PLANS_TABLE_SLICE,
} from '../../../../../configs/env';
import { HOME, HOME_URL, INTERVENTION_IRS_URL, IRS_PLAN_TYPE } from '../../../../../constants';
import { RouteParams } from '../../../../../helpers/utils';

import supersetFetch from '../../../../../services/superset';

import jurisdictionReducer, {
  fetchJurisdictions,
  getJurisdictionById,
  getJurisdictionsIdArray,
  Jurisdiction,
  reducerName as jurisdictionReducerName,
} from '../../../../../store/ducks/jurisdictions';
import plansReducer, {
  fetchPlanRecords,
  getPlanById,
  getPlanByPlanId,
  Plan,
  PlanRecord,
  reducerName as plansReducerName,
} from '../../../../../store/ducks/plans';

import HeaderBreadcrumbs, {
  BreadCrumbProps,
} from '../../../../../components/page/HeaderBreadcrumb/HeaderBreadcrumb';
import Loading from '../../../../../components/page/Loading';

/** register the plans reducer */
reducerRegistry.register(plansReducerName, plansReducer);
reducerRegistry.register(jurisdictionReducerName, jurisdictionReducer);

export interface IrsPlanProps {
  fetchJurisdictionsActionCreator: typeof fetchJurisdictions;
  fetchPlansActionCreator: typeof fetchPlanRecords;
  isDraftPlan?: boolean;
  isFinalizedPlan?: boolean;
  isNewPlan?: boolean;
  jurisdictionIds: string[];
  planById?: Plan | null;
  planId: string | null;
  supersetService: typeof supersetFetch;
}

export const defaultIrsPlanProps: IrsPlanProps = {
  fetchJurisdictionsActionCreator: fetchJurisdictions,
  fetchPlansActionCreator: fetchPlanRecords,
  isDraftPlan: false,
  isFinalizedPlan: false,
  isNewPlan: false,
  jurisdictionIds: [],
  planById: null,
  planId: null,
  supersetService: supersetFetch,
};

class IrsPlan extends React.Component<RouteComponentProps<RouteParams> & IrsPlanProps, {}> {
  public static defaultProps = defaultIrsPlanProps;
  constructor(props: RouteComponentProps<RouteParams> & IrsPlanProps) {
    super(props);
  }

  public componentDidMount() {
    const {
      fetchJurisdictionsActionCreator,
      fetchPlansActionCreator,
      jurisdictionIds,
      planId,
      planById,
      supersetService,
    } = this.props;

    if (planId && !planById) {
      const planSupersetParams = superset.getFormData(10, [
        { comparator: planId, operator: '==', subject: 'identifier' },
      ]);

      supersetService(SUPERSET_PLANS_TABLE_SLICE, planSupersetParams).then(
        (planResult: PlanRecord[]) => fetchPlansActionCreator(planResult)
      );
    }

    // get new jurisdictions associated with this plan
    if (planId) {
      const pivotParams = superset.getFormData(500, [
        { comparator: planId, operator: '==', subject: 'plan_id' },
      ]);
      supersetService(SUPERSET_PLAN_STRUCTURE_PIVOT_SLICE, pivotParams).then(
        relevantJuridictions => {
          if (!relevantJuridictions) {
            return new Promise((resolve, reject) => reject());
          }

          // define jurisdictions not in the store
          const jurisdictionIdsToGet = relevantJuridictions
            .map((j: any) =>
              !jurisdictionIds.includes(j.jurisdiction_id) ? j.jurisdiction_id : null
            )
            .filter((j: string | null) => j);

          if (!jurisdictionIdsToGet.length) {
            return new Promise(resolve => resolve());
          }

          // build superset adhoc filter expression
          let sqlFilterExpression = '';
          for (let i = 0; i < jurisdictionIdsToGet.length; i += 1) {
            const jurId = jurisdictionIdsToGet[i];
            if (i) {
              sqlFilterExpression += ' OR ';
            }
            sqlFilterExpression += `jurisdiction_id = '${jurId}'`;
          }

          // define superset params for
          const jurisdictionSupersetParams = superset.getFormData(1000, [
            { sqlExpression: sqlFilterExpression },
          ]);

          return supersetService(SUPERSET_JURISDICTIONS_SLICE, jurisdictionSupersetParams).then(
            (jurisdictionResults: Jurisdiction[]) =>
              fetchJurisdictionsActionCreator(jurisdictionResults)
          );
        }
      );
    }
  }

  public render() {
    const { planId, planById, isDraftPlan, isFinalizedPlan } = this.props;
    if (planId && !planById) {
      return <Loading />;
    }
    const homePage = {
      label: HOME,
      url: HOME_URL,
    };
    const basePage = {
      label: 'IRS',
      url: INTERVENTION_IRS_URL,
    };
    const pageLabel =
      (isFinalizedPlan && planById && planById.plan_title) ||
      (isDraftPlan && planById && `${planById.plan_title} (draft)`) ||
      'New Plan';
    const urlPathAppend =
      (isFinalizedPlan && `plan/${planId}`) || (isDraftPlan && `draft/${planId}`) || 'new';
    const breadCrumbProps: BreadCrumbProps = {
      currentPage: {
        label: pageLabel,
        url: `${INTERVENTION_IRS_URL}/${urlPathAppend}`,
      },
      pages: [homePage, basePage],
    };

    return (
      <div className="mb-5">
        <HeaderBreadcrumbs {...breadCrumbProps} />
        <h2 className="page-title">IRS: {pageLabel}</h2>
      </div>
    );
  }
}

/** Connect the component to the store */

/** interface to describe props from mapStateToProps */
interface DispatchedStateProps {
  planId: string | null;
}

export { IrsPlan };

const mapStateToProps = (state: Partial<Store>, ownProps: any): DispatchedStateProps => {
  const planId = ownProps.match.params.id || null;
  const isNewPlan = planId === null;
  const jurisdictionIds = getJurisdictionsIdArray(state);
  const plan = getPlanById(state, planId);
  const isDraftPlan = plan && plan.plan_status !== 'active';
  const isFinalizedPlan = plan && plan.plan_status === 'active';
  const props = {
    isDraftPlan,
    isFinalizedPlan,
    isNewPlan,
    jurisdictionIds,
    planById: plan,
    planId,
    ...ownProps,
  };
  return props;
};

const mapDispatchToProps = {
  fetchJurisdictionsActionCreator: fetchJurisdictions,
  fetchPlansActionCreator: fetchPlanRecords,
};

const ConnectedIrsPlan = connect(
  mapStateToProps,
  mapDispatchToProps
)(IrsPlan);

export default ConnectedIrsPlan;
