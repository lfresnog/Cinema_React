import React from "react";
import { gql, useQuery } from "@apollo/client";



const Login = (mail,pwd) => {
    const {loading,error,data} = useQuery(LOGIN_QUERY,{
        variables: {mail:mail, password:pwd},
    });


}