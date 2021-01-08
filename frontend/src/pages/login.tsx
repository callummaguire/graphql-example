import React from "react";
import { Formik, Form } from "formik";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
} from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { useLoginMutation } from "../generated/graphql";
import { arrayToMap } from '../utils/arrayToMap';
import { useRouter } from 'next/router';
interface registerProps {}



const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [,login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={ async (values, {setErrors}) => {
           const response = await login(values);
            if (response.data?.login.errors) {
              setErrors(arrayToMap(response.data?.login.errors))
            } else if (response.data?.login.user) {
              router.push("/");
            }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="username" placeholder="username" label="Username" type="username" />
            <InputField name="password" placeholder="password" label="Password" type="password" />
            <Button mt={4} variantColor="teal" isLoading={isSubmitting} type="submit">
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
