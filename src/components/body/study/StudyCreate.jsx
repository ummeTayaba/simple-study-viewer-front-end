import { Field, Form, Formik } from 'formik';
import axios from 'axios'
import React, { useEffect, useState } from "react";

import * as Yup from 'yup';

import {
    FormControl,
    FormLabel,
    Button,
    SimpleGrid,
    Select,
    Flex,
    Spinner,
    Box
  } from "@chakra-ui/react"


export const StudyCreate = (props) => {
    if (props.id) {
        return (
            <StudyEdit id={props.id} />
        )
    }

    return (
        <>
            <StudyCreateNew />
        </>
    )
}

const StudyCreateEditValidationSchema = Yup.object().shape({
    studyName: Yup.string()
      .max(50, 'Too Long!')
      .required('Required'),
    studyDescription: Yup.string()
      .max(200, 'Too Long!')
      .required('Required'),
    patient: Yup.string().required('Required'),
  });

const StudyForm = (props) => {
    const patients = props.patients ?? []
    const editStudyData = props.study

    return (
        <SimpleGrid columns={1} spacingX="40px" spacingY="20px" m={10}>
        <Formik
            initialValues={{
                studyName: editStudyData? editStudyData.studyName : '',
                studyDescription: editStudyData? editStudyData.studyDescription :'',
                patient: editStudyData? editStudyData.patient.id : patients.length > 0? patients[0].id : null
            }}
            onSubmit={values => {
                console.log(values);
            }}
            validationSchema={StudyCreateEditValidationSchema}
        >

        {({ errors, touched, handleChange, values, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
                <Flex >
                    <FormControl id="studyName">
                        <FormLabel>Study Name</FormLabel>
                        <Field name="studyName"/>
                    </FormControl>

                    <Box width={10}/>

                    <FormControl id="studyDescription">
                        <FormLabel>Study Description</FormLabel>
                        <Field name="studyDescription" />
                    </FormControl>
                </Flex>
                

                <FormControl id="patient">
                    <FormLabel>Patient</FormLabel>
                    <Select onChange={handleChange} value={values.patient}>
                        {
                            patients.map(patient => {
                                return (
                                    <option value={patient.id}>{patient.firstName} {patient.lastName}({patient.personCode})</option>
                                )
                            })
                        }
                    </Select>
                </FormControl>

                <Flex justify="center">
                    <Button
                        mt={4}
                        isLoading={false}
                        type="submit">
                        Submit
                    </Button>
                </Flex>
                
            </form>
        )}
        </Formik>
        
        </SimpleGrid>
        
    )
}

const StudyEdit = (props) => {

    return (
        <div>
            Not implemented
        </div>
    )
}

const StudyCreateNew = () => {

    const [apiResponse, setApiResponse] = useState({
        patientListData: [],
        loading: true,
        errorMessage: ""
    })

    useEffect(() => {
        
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/patients`).then(response => {
            const patientData = response.data
            setApiResponse({
                ...apiResponse,
                loading: false,
                patientListData: patientData
            })

        }).catch(e => {
            setApiResponse({
                ...apiResponse,
                loading: false,
                errorMessage: e.errorMessage
            })
        })
    }, [])

    if (apiResponse.loading) {
        return (
            <Flex justify="center">
                <Spinner size="xl" />
            </Flex>
        )
    }


    return (
        <StudyForm patients={apiResponse.patientListData} />
    )
}

