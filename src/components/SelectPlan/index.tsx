import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Select from 'react-select';
import { FI_SINGLE_MAP_URL } from '../../constants';
import { Plan } from '../../store/ducks/plans';

export interface SelectPlanProps extends RouteComponentProps {
  plansArray: Plan[];
}
class SelectPlan extends React.Component<SelectPlanProps, {}> {
  constructor(props: SelectPlanProps) {
    super(props);
  }
  public change = (e: any) => {
    /** Dirty Mangy Hack */
    this.props.history.push('/focus-investigation');
    setTimeout(() => {
      this.props.history.push(`${FI_SINGLE_MAP_URL}/${e.value}`);
    }, 250);
  };
  public render() {
    const { plansArray } = this.props;
    /** Sort plans by plan_date and build value label key value pairs to populate the select */
    let options;
    options = plansArray.sort((a, b) => {
      return a.plan_date === b.plan_date ? 0 : +(a.plan_date < b.plan_date) || -1;
    });
    options = options.map(element => {
      return { value: element.id, label: element.plan_title };
    });
    return <Select options={options} onChange={this.change} />;
  }
}

const SelectComponent = withRouter(SelectPlan);

export default SelectComponent;
