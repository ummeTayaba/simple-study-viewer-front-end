import axios from 'axios'
import React, { useEffect, useState } from "react";
import { Spinner, Flex } from "@chakra-ui/react"
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    Popover,
    PopoverBody,
    PopoverContent,
    SimpleGrid,
    Box,
    Button,
    PopoverArrow,
    PopoverTrigger,
    PopoverCloseButton,
    PopoverHeader,
  } from "@chakra-ui/react"
import { useHistory } from 'react-router-dom';


export const StudyList = () => {
    const [apiResponse, setApiResponse] = useState({
        data: [],
        loading: true,
        errorMessage: ""
    })

    const history = useHistory()

    useEffect(() => {
        
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/studies`).then(response => {
            const studyData = response.data
            setApiResponse({
                ...apiResponse,
                loading: false,
                data: studyData
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
        <Table>
            <TableCaption>Study List</TableCaption>
            <Thead>
                <Tr>
                    <Th>Patient Person Code</Th>
                    <Th>Study Name</Th>
                    <Th>Study Creation Time(MM/DD/YYYY)</Th>
                    <Th>Study Update Time(MM/DD/YYYY)</Th>
                    <Th>Edit</Th>
                </Tr>
            </Thead>

            <Tbody>
                {
                    apiResponse.data.map(data => {
                        return (
                            <Tr>
                                <Td>
                                    <Popover>
                                    <PopoverTrigger>
                                        <Button>{data.patient.personCode}</Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverHeader>Person Info: {data.patient.personCode}</PopoverHeader>
                                        <PopoverBody>
                                            <SimpleGrid columns={1} spacingX="40px" spacingY="20px">
                                                <Box p={4}>
                                                    Full Name: {data.patient.firstName} {data.patient.lastName}
                                                </Box>
                                                <Box p={4}>
                                                    Patient's date of birth: {new Date(data.patient.dateOfBirth).toLocaleDateString("en-US")}
                                                </Box>
                                            </SimpleGrid>
                                        </PopoverBody>
                                    </PopoverContent>
                                    </Popover>
                                </Td>

                                <Td>{data.studyName}</Td>
                                <Td>{new Date(data.studyCreationTime).toLocaleDateString("en-US")}</Td>
                                <Td>{new Date(data.studyUpdateTime).toLocaleDateString("en-US")}</Td>

                                <Td>
                                    <Button onClick={
                                        () => {
                                            history.push(`/study/edit/${data.id}`)
                                        }
                                    }>
                                        Edit
                                    </Button>
                                </Td>
                            </Tr>
                        )
                    })
                }
            </Tbody>

        </Table>
    )
}