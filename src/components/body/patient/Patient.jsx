import axios from 'axios'
import React, { useEffect, useState } from "react";
import { Spinner, Flex } from "@chakra-ui/react"
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
  } from "@chakra-ui/react"


export const List = () => {
    const [apiResponse, setApiResponse] = useState({
        data: [],
        loading: true,
        errorMessage: ""
    })

    useEffect(() => {
        
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/patients`).then(response => {
            const patientData = response.data
            setApiResponse({
                ...apiResponse,
                loading: false,
                data: patientData
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
            <TableCaption>Patient List</TableCaption>
            <Thead>
                <Tr>
                    <Th>Person Code</Th>
                    <Th>Patient Full Name</Th>
                    <Th>Patient's Date of Birth(MM/DD/YYYY)</Th>
                </Tr>
            </Thead>

            <Tbody>
                {
                    apiResponse.data.map(data => {
                        return (
                            <Tr>
                                <Td>{data.personCode}</Td>
                                <Td>{data.firstName} {data.lastName}</Td>
                                <Td>{ new Date(data.dateOfBirth).toLocaleDateString("en-US") }</Td>
                            </Tr>
                        )
                    })
                }
            </Tbody>

        </Table>
    )
}

export const Create = () => {
    return (
        <div></div>
    )
}