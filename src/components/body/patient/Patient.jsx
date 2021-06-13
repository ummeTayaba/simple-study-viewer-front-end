import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Spinner, Flex } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './custom-datepicker-decorator.css';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Input,
  FormErrorMessage,
  FormControl,
  FormLabel,
  Button,
  Text,
  ListItem,
  SimpleGrid,
  UnorderedList,
  Box,
} from '@chakra-ui/react';

import * as moment from 'moment';
import { Field, Form, Formik } from 'formik';
import { useHistory, useParams } from 'react-router-dom';

import * as Yup from 'yup';

export const List = () => {
  const history = useHistory();
  const [apiResponse, setApiResponse] = useState({
    data: [],
    loading: true,
    errorMessage: '',
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/patients`)
      .then(response => {
        const patientData = response.data;
        setApiResponse({
          ...apiResponse,
          loading: false,
          data: patientData,
        });
      })
      .catch(e => {
        setApiResponse({
          ...apiResponse,
          loading: false,
          errorMessage: e.errorMessage,
        });
      });
  }, []);

  if (apiResponse.loading) {
    return (
      <Flex justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Table>
      <TableCaption>Patient List</TableCaption>
      <Thead>
        <Tr>
          <Th>Person Code</Th>
          <Th>Patient Full Name</Th>
          <Th>Patient's Date of Birth(MM/DD/YYYY)</Th>
          <Th>Edit</Th>
        </Tr>
      </Thead>

      <Tbody>
        {apiResponse.data.map(data => {
          return (
            <Tr>
              <Td>{data.personCode}</Td>
              <Td>
                {data.firstName} {data.lastName}
              </Td>
              <Td>{new Date(data.dateOfBirth).toLocaleDateString('en-US')}</Td>
              <Td>
                <Button
                  onClick={() => {
                    history.push(`/patient/edit/${data.id}`);
                  }}
                >
                  Edit
                </Button>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export const Create = () => {
  const { id } = useParams();

  if (id) {
    return <PatientEdit id={id} />;
  }

  return (
    <>
      <PatientCreateNew />
    </>
  );
};

const PatientEdit = props => {
  const [apiResponse, setApiResponse] = useState({
    patient: null,
    loading: true,
    errorMessage: '',
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/patients/${props.id}`)
      .then(response => {
        const patientData = response.data;

        setApiResponse(apiResponseData => {
          return {
            ...apiResponseData,
            loading: false,
            patient: patientData,
          };
        });
      })
      .catch(e => {
        setApiResponse(apiResponseData => {
          return {
            ...apiResponseData,
            loading: false,
            errorMessage: e.errorMessage,
          };
        });
      });
  }, []);

  if (apiResponse.loading) {
    return (
      <Flex justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return <PatientForm patient={apiResponse.patient} />;
};

const PatientCreateNew = () => {
  return <PatientForm />;
};

const PatientForm = props => {
  const editPatientData = props.patient;
  const history = useHistory();

  const [startDate, setStartDate] = useState(
    editPatientData ? new Date(editPatientData.dateOfBirth) : new Date()
  );
  const [startDateStr, setStartDateStr] = useState(
    moment(startDate).format('dd/MM/yyyy')
  );

  const requestURL = editPatientData
    ? `${process.env.REACT_APP_API_BASE_URL}/patients/${editPatientData.id}`
    : `${process.env.REACT_APP_API_BASE_URL}/patients`;

  const [apiErrorMessages, setApiErrorMessages] = useState([]);

  const handleSubmitForPatientData = (values, setSubmitting) => {
    axios
      .post(requestURL, values)
      .then(response => {
        history.push(`/patient/list`);
      })
      .catch(e => {
        console.log(e);
        const errorList = Object.values(e.response.data).map(errorMessage => {
          return (
            <ListItem>
              <Text color="red.500">{errorMessage}</Text>
            </ListItem>
          );
        });

        setApiErrorMessages(errorList);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const PatientCreateEditValidationSchema = Yup.object().shape({
    firstName: Yup.string().max(50, 'Too Long!').required('Required'),
    lastName: Yup.string().max(50, 'Too Long!').required('Required'),
    personCode: Yup.string().max(50, 'Too Long!').required('Required'),
    dateOfBirth: Yup.string()
      .required('Required')
      .test('is-valid-date', 'Should be a valid date format', function (value) {
        const dateParts = value.split('/');
        return moment(
          new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
        ).isValid();
      })
      .test('is-less', 'Should be a date less than today', function (value) {
        const dateParts = value.split('/');
        const dateVal = moment(
          new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
        );

        const now = moment(new Date());

        return dateVal.isSameOrBefore(now);
      }),
  });

  return (
    <SimpleGrid columns={1} spacingX="40px" spacingY="20px" m={10}>
      <Flex justify="center">
        {apiErrorMessages.length > 0 ? (
          <UnorderedList>{apiErrorMessages}</UnorderedList>
        ) : (
          <div></div>
        )}
      </Flex>

      <Formik
        validateOnChange={true}
        initialValues={{
          id: editPatientData ? editPatientData.id : 0,
          firstName: editPatientData ? editPatientData.firstName : '',
          lastName: editPatientData ? editPatientData.lastName : '',
          personCode: editPatientData ? editPatientData.personCode : '',
          dateOfBirth: editPatientData
            ? moment(new Date(editPatientData.dateOfBirth)).format('DD/MM/YYYY')
            : moment(new Date()).format('DD/MM/YYYY'),
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmitForPatientData(values, setSubmitting);
        }}
        validationSchema={PatientCreateEditValidationSchema}
      >
        {({ validateField, values, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Flex>
              <Field name="firstName">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.firstName && form.touched.firstName}
                  >
                    <FormLabel htmlFor="firstName">
                      Patient First Name
                    </FormLabel>
                    <Input
                      {...field}
                      id="firstName"
                      placeholder="Patient Name"
                    />
                    <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Box width={10} />

              <Field name="lastName">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.lastName && form.touched.lastName}
                  >
                    <FormLabel htmlFor="lastName">Patient Last Name</FormLabel>
                    <Input
                      {...field}
                      id="lastName"
                      placeholder="Patient Last Name"
                    />
                    <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Box width={10} />
            </Flex>

            <Box height={10} />

            <Flex>
              <Field name="personCode">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors.personCode && form.touched.personCode
                    }
                  >
                    <FormLabel htmlFor="personCode">Person Code</FormLabel>
                    <Input
                      {...field}
                      id="personCode"
                      placeholder="Person Code"
                    />
                    <FormErrorMessage>
                      {form.errors.personCode}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Box width={10} />

              <Field name="dateOfBirth">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.dateOfBirth}>
                    <FormLabel htmlFor="dateOfBirth">
                      Patient's Date of Birth{' '}
                    </FormLabel>

                    <div className="customDatePickerWidth">
                      <DatePicker
                        selected={startDate}
                        dateFormat="dd/MM/yyyy"
                        onSelect={date => {
                          setStartDate(date);
                          form.setFieldValue(
                            'dateOfBirth',
                            moment(date).format('DD/MM/YYYY')
                          );

                          validateField('dateOfBirth');
                        }}
                        customInput={
                          <Input
                            {...field}
                            id="dateOfBirth"
                            placeholder="Patient's Date of Birth"
                          />
                        }
                      />
                    </div>

                    <FormErrorMessage>
                      {form.errors.dateOfBirth}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Box width={10} />
            </Flex>

            <Box height={10} />

            <Flex justify="center">
              <Button mt={4} isLoading={isSubmitting} type="submit">
                Submit
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </SimpleGrid>
  );
};
