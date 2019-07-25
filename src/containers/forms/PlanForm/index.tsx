import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import { Button, FormGroup, Label } from 'reactstrap';
import * as Yup from 'yup';
import { FIClassifications, FIReasons, FIStatuses } from '../../../configs/settings';
import { REQUIRED, SAVING } from '../../../constants';
import { InterventionType } from '../../../store/ducks/plans';

/** Allowed FI Status values */
type FIStatusType = typeof FIStatuses[number];

/** Allowed FI Status values */
type FIReasonType = typeof FIReasons[number];

/** Array of FI Statuses */
const fiStatusCodes = Object.values(FIClassifications).map(e => e.code as FIStatusType);

/** Yup validation schema for PlanForm */
const PlanSchema = Yup.object().shape({
  caseNum: Yup.string(),
  fiReason: Yup.string().oneOf(FIReasons.map(e => e)),
  fiStatus: Yup.string().oneOf(fiStatusCodes),
  interventionType: Yup.string()
    .oneOf(Object.keys(InterventionType))
    .required(REQUIRED),
  opensrpEventId: Yup.string(),
  title: Yup.string().required(REQUIRED),
});

/** Plan form fields interface */
interface PlanFormFields {
  caseNum?: string;
  fiReason?: FIReasonType;
  fiStatus?: FIStatusType;
  interventionType: InterventionType;
  opensrpEventId?: string;
  title: string;
}

/** initial values */
const initialValues: PlanFormFields = {
  caseNum: undefined,
  fiReason: undefined,
  fiStatus: undefined,
  interventionType: InterventionType.FI,
  opensrpEventId: undefined,
  title: '',
};

/** Plan Form component */
const PlanForm = () => {
  return (
    <div className="form-container">
      <Formik
        initialValues={initialValues}
        /* tslint:disable-next-line jsx-no-lambda */
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
        validationSchema={PlanSchema}
      >
        {({ errors, isSubmitting }) => (
          <Form>
            <FormGroup>
              <Label for="interventionType">Intervention Type</Label>
              <Field
                component="select"
                name="interventionType"
                id="interventionType"
                className={errors.interventionType ? 'form-control is-invalid' : 'form-control'}
              >
                <option value={InterventionType.FI}>Focus Investigation</option>
                <option value={InterventionType.IRS}>IRS</option>
              </Field>
              <ErrorMessage
                name="interventionType"
                component="small"
                className="form-text text-danger"
              />
            </FormGroup>
            <FormGroup>
              <Label for="fiStatus">Focus Investigation Status</Label>
              <Field
                component="select"
                name="fiStatus"
                id="fiStatus"
                className={errors.fiStatus ? 'form-control is-invalid' : 'form-control'}
              >
                <option>----</option>
                {Object.entries(FIClassifications).map(e => (
                  <option key={e[1].code} value={e[1].code}>
                    {e[1].code} - {e[1].name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="fiStatus" component="small" className="form-text text-danger" />
            </FormGroup>
            <FormGroup>
              <Label for="fiReason">Focus Investigation Reason</Label>
              <Field
                component="select"
                name="fiReason"
                id="fiReason"
                className={errors.fiReason ? 'form-control is-invalid' : 'form-control'}
              >
                <option>----</option>
                {FIReasons.map(e => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="fiReason" component="small" className="form-text text-danger" />
            </FormGroup>
            <FormGroup>
              <Label for="caseNum">Case Number</Label>
              <Field
                type="text"
                name="caseNum"
                id="caseNum"
                className={errors.caseNum ? 'form-control is-invalid' : 'form-control'}
              />
              <ErrorMessage name="caseNum" component="small" className="form-text text-danger" />
              <Field type="hidden" name="opensrpEventId" id="opensrpEventId" readOnly={true} />
            </FormGroup>
            <FormGroup>
              <Label for="title">Plan Title</Label>
              <Field
                type="text"
                name="title"
                id="title"
                className={errors.title ? 'form-control is-invalid' : 'form-control'}
              />
              <ErrorMessage name="title" component="small" className="form-text text-danger" />
            </FormGroup>
            <Button
              type="submit"
              className="btn btn-block"
              color="primary"
              aria-label="Save Plan"
              disabled={isSubmitting}
            >
              {isSubmitting ? SAVING : 'Save Plan'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PlanForm;
