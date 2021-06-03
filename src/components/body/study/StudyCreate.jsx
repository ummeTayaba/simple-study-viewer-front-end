import { Field, Form, Formik } from 'formik';
import axios from 'axios'
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import * as Yup from 'yup';

import {
    FormControl,
    FormLabel,
    Button,
    SimpleGrid,
    Select,
    Flex,
    Spinner,
    Box,
    Text,
    Input,
    FormErrorMessage,
    List, ListItem, ListIcon, OrderedList, UnorderedList
} from "@chakra-ui/react"

export const StudyCreate = () => {
    const { id } = useParams()
    
    if (id) {
        return (
            <StudyEdit id={id} />
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
      .max(200, 'Too Long!'),
    patientId: Yup.string().required('Required'),
  });

const StudyForm = (props) => {
    const patients = props.patients ?? []
    const editStudyData = props.study
    const history = useHistory()

    const requestURL = editStudyData? `${process.env.REACT_APP_API_BASE_URL}/studies/${editStudyData.id}` 
                                        : `${process.env.REACT_APP_API_BASE_URL}/studies`

    const [apiErrorMessages, setApiErrorMessages] = useState([])

    const handleSubmitForStudyData = (values, setSubmitting) => {
        console.log(values)

        axios.post(requestURL, values).then((response) => {
            history.push(`/study/list`)
        }).catch(e => {
            console.log()
            const errorList = Object.values(e.response.data).map(errorMessage => {
                return (<ListItem>
                    <Text color="red.500">
                        { errorMessage }
                    </Text>
                </ListItem>)
            })

            setApiErrorMessages(errorList)
        }).finally(() => {
            setSubmitting(false)
        })
    }

    return (
        <SimpleGrid columns={1} spacingX="40px" spacingY="20px" m={10}>
            
        <Flex justify="center">
            {
                apiErrorMessages.length > 0? (
                    <UnorderedList>
                        {apiErrorMessages}
                    </UnorderedList>
                ) : (
                    <div>
                    </div>
                )
            }
        </Flex>
        
        <Formik
            initialValues={{
                id: editStudyData? editStudyData.id : 0,
                studyName: editStudyData? editStudyData.studyName : '',
                studyDescription: editStudyData? editStudyData.studyDescription :'',
                patientId: editStudyData? editStudyData.patient.id : patients.length > 0? patients[0].id : null
            }}
            onSubmit={(values, { setSubmitting })  => {
                handleSubmitForStudyData(values, setSubmitting)
            }}
            validationSchema={StudyCreateEditValidationSchema}
        >

        

        {({ handleChange, values, handleSubmit, isSubmitting}) => (
            <Form onSubmit={handleSubmit}>
                <Flex >
                    <Field name="studyName">
                        {({ field, form }) => (
                            <FormControl isInvalid={form.errors.studyName && form.touched.studyName}>
                                <FormLabel htmlFor="studyName">Study Name</FormLabel>
                                <Input {...field} id="studyName" placeholder="Study Name" />
                                <FormErrorMessage>{form.errors.studyName}</FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>

                    <Box width={10}/>

                    <Field name="studyDescription">
                        {({ field, form }) => (
                            <FormControl isInvalid={form.errors.studyDescription && form.touched.studyDescription}>
                                <FormLabel htmlFor="studyDescription">Study Description </FormLabel>
                                <Input {...field} id="studyDescription" placeholder="Study Description" />
                                <FormErrorMessage>{form.errors.studyDescription}</FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>

                </Flex>
                

                <FormControl id="patientId">
                    <FormLabel>Patient</FormLabel>
                    <Select onChange={handleChange} value={values.patientId}>
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
                        isLoading={isSubmitting}
                        type="submit">
                        Submit
                    </Button>
                </Flex>
                
            </Form>
        )}
        </Formik>
        
        </SimpleGrid>
        
    )
}

const StudyEdit = (props) => {

    const [apiResponse, setApiResponse] = useState({
        patientListData: [],
        study: null,
        loading: true,
        loadingStudy: true,
        errorMessage: ""
    })

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/studies/${props.id}`).then(response => {
            const studyData = response.data

            setApiResponse((apiResponseData) => {
                return {
                ...apiResponseData,
                loadingStudy: false,
                study: studyData
            }})

        }).catch(e => {
            setApiResponse((apiResponseData) => {
                return {
                ...apiResponseData,
                loadingStudy: false,
                errorMessage: e.errorMessage
            }})
        })

        
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/patients`).then(response => {
            const patientData = response.data
            setApiResponse((apiResponseData) => {
                return {
                ...apiResponseData,
                loading: false,
                patientListData: patientData
            }})

        }).catch(e => {
            setApiResponse((apiResponseData) => {
                return {
                ...apiResponseData,
                loading: false,
                errorMessage: e.errorMessage
            }})
        })
    }, [])

    if (apiResponse.loading || apiResponse.loadingStudy) {
        return (
            <Flex justify="center">
                <Spinner size="xl" />
            </Flex>
        )
    }


    return (
        <StudyForm patients={apiResponse.patientListData} study={apiResponse.study} />
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

