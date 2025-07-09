import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { loginUser } from '../../services/authService';
import { handleError, handleSuccess } from '../../utils/toastUtils';
import PublicLayout from '../../layout/PublicLayout';

const UserLogin = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await loginUser({ email: data.email, password: data.password });
            localStorage.setItem('token', response.token);
            localStorage.setItem('id', response.id);
            localStorage.setItem('role', response.role);
            localStorage.setItem('name', response.name);
            handleSuccess('User loggedin successful!');
            navigate('/');
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <PublicLayout>
            <div className="w-full h-screen">
                <img
                    src="https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg"
                    alt="/"
                    className="hidden sm:block absolute w-full h-full object-cover"
                />
                <div className="bg-black/60 fixed top-0 left-0 w-full h-screen"></div>
                <div className="fixed w-full px-4 py-24 z-50">
                    <div className="max-w-[450px] h-[600px] mx-auto bg-black/75 text-white">
                        <div className="max-w-[320px] mx-auto py-16">
                            <h1 className="text-3xl font-bold">Login</h1>
                            <Form noValidate onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col py-4'>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Control
                                        type="email"
                                        className="p-3 my-2 bg-gray-700 rouded"
                                        placeholder="Enter email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Enter a valid email address'
                                            }
                                        })}
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Control
                                        type="password"
                                        className="p-3 bg-gray-700 rouded"
                                        placeholder="Enter password"
                                        {...register('password', {
                                            required: 'Password is required'
                                        })}
                                        isInvalid={!!errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* <Button variant="primary" type="submit" className="mt-4 w-100" disabled={isSubmitting}>
                                    Login
                                </Button> */}
                                <button className="bg-cyan-600 py-3 my-6 rounded w-full font-bold">
                                    Sign In
                                </button>
                                <p className="py-8">
                                    <span className="text-gray-600">New to MovieHub?</span>{" "}
                                    <Link to="/register">Sign Up</Link>
                                </p>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default UserLogin;