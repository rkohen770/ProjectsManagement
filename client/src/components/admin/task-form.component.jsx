import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
    Button,
    message,
    Select,
    Form,
    Input,
    Space,
    DatePicker,
} from 'antd'

import taskService from '../../services/task.service'
import userService from '../../services/user.service'



TaskForm.propTypes = {
    task: PropTypes.object,
    onSubmitSuccess: PropTypes.func.isRequired,
    project: PropTypes.object
};

export function TaskForm({ task, onSubmitSuccess, project }) {

    const [submitLoading, setSubmitLoading] = useState(false)
    const [formTask, setFormTask] = useState(task);
    const [users, setUsers] = useState([])

    useEffect(() => {
        setFormTask(task);
    }, [task]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await userService.getAllUsers();
            if (response.status === 200) {
                setUsers(response.data.filter(user => user.role === 'employee'));
            }
            else {
                console.log(response.message);
                message.error(response.message);
            }
        }
        fetchData();
    }, [users]);

    const [form] = Form.useForm()

    const onFinish = async (values) => {
        try {
            setSubmitLoading(true)
            const newTask = {
                name: values.name,
                description: values.description,
                deadLine: values.deadLine,
                employeeId: values.user,
                projectId: project.id
            }
            if (formTask) {
                const response = await taskService.updateTask(formTask.id, newTask)
                if (response.status === 200) {
                    message.success('the task has been updated successfully!')
                    if (onSubmitSuccess) {
                        onSubmitSuccess(response.data)
                    }
                } else {
                    message.error(response.message)
                }
            } else {
                const response = await taskService.createTask(newTask)
                if (response.status === 200) {
                    message.success('the task has been created successfully!')
                    if (onSubmitSuccess) {
                        onSubmitSuccess()
                    }
                } else {
                    message.error(response.message)
                }
            }
        } catch (error) {
            console.log(error)
            message.error('an error has occurred while you were trying to create the task')
        } finally {
            setSubmitLoading(false)
        }
    }

    const onChange = (value) => {
        console.log(`selected ${value}`);
    }
    const onSearch = (value) => {
        console.log('search:', value);
    }

    // Filter `option.label` match the user type `input`
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <Form
            form={form}
            name="task-form"
            onFinish={onFinish}
            initialValues={{
                name: formTask?.name,
                description: formTask?.description,
                deadLine: formTask?.deadLine ? dayjs(formTask.deadLine) : null,
            }}
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[
                    {
                        required: true,
                        message: 'Please input the task name!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="description"
                label="Description"
                rules={[
                    {
                        required: true,
                        message: 'Please input the task description!',
                    },
                ]}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item
                name="user"
                label="User"
                rules={[
                    {
                        required: true,
                        message: 'Please select user to do the task!',
                    },
                ]}
            >
                <Select
                    showSearch
                    placeholder="Select a user"
                    optionFilterProp="label"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    options={users.map(user => ({ value: user.id, label: user.userName }))}
                >
                </Select>
            </Form.Item>
            <Form.Item
                name="deadLine"
                label="Deadline"
                rules={[
                    {
                        required: true,
                        message: 'Please input the task deadLine!',
                    },
                ]}
            >
                <DatePicker />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" loading={submitLoading}>
                        Submit
                    </Button>
                    <Button htmlType="button" onClick={() => form.resetFields()}>
                        Reset
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    )
}
