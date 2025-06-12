import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { loginAdmin } from '../../services/authService';
import { handleError, handleSuccess } from '../../utils/toastUtils';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting } 
    } = useForm();

    const onSubmit = async (data) => {

        try {
            const response = await loginAdmin({ email: data.email, password: data.password });
            localStorage.setItem('token', response.token);
            localStorage.setItem('id', response.id);
            localStorage.setItem('role', response.role); 
            localStorage.setItem('name', response.name); 
            handleSuccess('Admin login successful!');
            navigate('/admin'); 
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100">
                <Col md={6} className="mx-auto">
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Admin Login</h2>
                            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
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
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
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
                                <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                                    Login
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminLogin;