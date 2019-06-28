import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { createBrowserHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { FI_SINGLE_URL } from '../../../../../../constants';
import { wrapFeatureCollection } from '../../../../../../helpers/utils';
import store from '../../../../../../store';
import { fetchGoals } from '../../../../../../store/ducks/goals';
import { fetchJurisdictions } from '../../../../../../store/ducks/jurisdictions';
import { fetchPlans, Plan } from '../../../../../../store/ducks/plans';
import { fetchTasks } from '../../../../../../store/ducks/tasks';
import * as fixtures from '../../../../../../store/ducks/tests/fixtures';
import ConnectedMapSingleFI, { SingleActiveFIMap } from '../../active/';

jest.mock('../../../../../../components/GisidaWrapper', () => {
  const GisidaWrapperMock = () => <div>I love oov</div>;
  return GisidaWrapperMock;
});
jest.mock('../../../../../../configs/env');

const history = createBrowserHistory();

describe('containers/pages/FocusInvestigation/activeMap', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without crashing', () => {
    const mock: any = jest.fn();
    const props = {
      currentGoal: fixtures.goal3.goal_id,
      featureCollection: wrapFeatureCollection([fixtures.coloredTasks.task4.geojson]),
      goals: [fixtures.goal3],
      history,
      jurisdiction: fixtures.jurisdictions[0],
      location: mock,
      match: {
        isExact: true,
        params: { id: fixtures.plan1.id },
        path: `${FI_SINGLE_URL}/:id`,
        url: `${FI_SINGLE_URL}/13`,
      },
      plan: fixtures.plan1 as Plan,
    };
    shallow(
      <Router history={history}>
        <SingleActiveFIMap {...props} />
      </Router>
    );
  });

  it('renders SingleActiveFimap correctly', () => {
    const mock: any = jest.fn();
    const props = {
      currentGoal: fixtures.goal3.goal_id,
      featureCollection: wrapFeatureCollection([fixtures.coloredTasks.task4.geojson]),
      goals: [fixtures.goal3],
      history,
      jurisdiction: fixtures.jurisdictions[0],
      location: mock,
      match: {
        isExact: true,
        params: { id: fixtures.plan1.id },
        path: `${FI_SINGLE_URL}/:id`,
        url: `${FI_SINGLE_URL}/13`,
      },
      plan: fixtures.plan1 as Plan,
    };
    const wrapper = mount(
      <Router history={history}>
        <SingleActiveFIMap {...props} />
      </Router>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('GisidaWrapperMock').props()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('works with redux store', () => {
    const mock: any = jest.fn();
    store.dispatch(fetchGoals([fixtures.goal3]));
    store.dispatch(fetchJurisdictions([fixtures.jurisdictions[0]]));
    store.dispatch(fetchPlans([fixtures.plan1 as Plan]));
    store.dispatch(fetchTasks(fixtures.tasks));
    const props = {
      currentGoal: fixtures.goal3,
      featureCollection: {
        features: [fixtures.task4.geojson],
        type: 'FeatureCollection',
      },
      history,
      location: mock,
      match: {
        isExact: true,
        params: { id: fixtures.plan1.id },
        path: `${FI_SINGLE_URL}/:id`,
        url: `${FI_SINGLE_URL}/13`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedMapSingleFI {...props} />
        </Router>
      </Provider>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('GisidaWrapperMock').props()).toMatchSnapshot();
    wrapper.unmount();
  });
});
