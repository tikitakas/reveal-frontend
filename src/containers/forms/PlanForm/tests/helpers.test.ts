import { InterventionType } from '../../../../store/ducks/plans';
import { PlanSchema } from '../helpers';

/** Answers : among the validation errors raised, is there an error obj
 * associated with the caseNum property resulting from caseNum being required
 */
const isCaseNumErrorPresent = (errors: any): boolean => {
  const caseNumAssociatedErrors = errors.inner.filter(
    (err: any) => err.path === 'caseNum' && err.message === 'Required'
  );
  return !!caseNumAssociatedErrors.length;
};

describe('src/containers/forms/PlanForm.PlanSchema.caseNum', () => {
  /** Case Num requireability is dependent on whether the
   * Intervention Type value is FI
   */
  it('validationError if Intervention is FI && no caseNum', () => {
    const badCaseNum = {
      interventionType: InterventionType.FI,
    };

    try {
      PlanSchema.validateSync(badCaseNum, { abortEarly: false });
    } catch (errors) {
      expect(isCaseNumErrorPresent(errors)).toBeTruthy();
    }
  });

  it('No validationError if Intervention is FI && caseNum present', () => {
    const goodCaseNum = {
      caseNum: 'Case Num',
      interventionType: InterventionType.FI,
    };

    try {
      PlanSchema.validateSync(goodCaseNum, { abortEarly: false });
    } catch (errors) {
      expect(isCaseNumErrorPresent(errors)).toBeFalsy();
    }
  });

  it('No validationError if Intervention is FI and no caseNum', () => {
    const goodCaseNum = {
      interventionType: InterventionType.IRS,
    };

    try {
      PlanSchema.validateSync(goodCaseNum, { abortEarly: false });
    } catch (errors) {
      expect(isCaseNumErrorPresent(errors)).toBeFalsy();
    }
  });
});
