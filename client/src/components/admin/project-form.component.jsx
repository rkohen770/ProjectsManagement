import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  Button,
  message,
  ColorPicker,
  Form,
  Input,
  Space,
  DatePicker,
} from 'antd'

import projectService from '../../services/project.service'

ProjectForm.propTypes = {
  project: PropTypes.object,
  onSubmitSuccess: PropTypes.func.isRequired,
};
export function ProjectForm({ project, onSubmitSuccess }) {
  const [submitLoading, setSubmitLoading] = useState(false)
  const [formProject, setFormProject] = useState(project);

  useEffect(() => {
    setFormProject(project);
  }, [project]);

  const [form] = Form.useForm()

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true)
      const newProject = {
        name: values.name,
        description: values.description,
        deadLine: values.deadLine,
      }
      if (formProject) {
        const response = await projectService.updateProject(formProject.id, newProject)
        if (response.status === 200) {
          message.success('the project has been updated successfully!')
          if (onSubmitSuccess) {
            onSubmitSuccess(response.data)
          }
        } else {
          message.error(response.message)
        }
      } else {
        const response = await projectService.createProject(newProject)
        if (response.status === 200) {
          message.success('the project has been created successfully!')
          if (onSubmitSuccess) {
            onSubmitSuccess()
          }
        } else {
          message.error(response.message)
        }
      }
    } catch (error) {
      console.log(error)
      message.error('an error has occurred while you were trying to save the project')
    } finally {
      setSubmitLoading(false)
    }
  }

  const onFinishFailed = () => {
    message.error('Submit failed!')
  }

  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="vertical"
        disabled={submitLoading}
        style={{
          justifyContent: 'center',
          alignItems: 'stretch',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          name: formProject ? formProject.name : 'new project',
          description: formProject ? formProject.description : 'this is a new project',
          deadLine: formProject ? dayjs(formProject.deadLine) : dayjs(),
        }}
      >
        <Form.Item
          name="name"
          label="name of project"
          required={true}
          rules={[
            { required: true, message: 'name of project is required', type: 'string' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="deadLine" label="deadLine">
          <DatePicker format={'DD/MM/YYYY'} />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 4 }}>
          <Space>
            <Button htmlType="submit">save</Button>
            <Button htmlType="reset">clear</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}
