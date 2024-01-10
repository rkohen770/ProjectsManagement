import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  Button,
  message,
  Form,
  Input,
  Space,
  DatePicker,
  Upload,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import projectService from '../../services/project.service'

ProjectForm.propTypes = {
  project: PropTypes.object,
  onSubmitSuccess: PropTypes.func.isRequired,
};
export function ProjectForm({ project, onSubmitSuccess }) {
  const [submitLoading, setSubmitLoading] = useState(false)
  const [formProject, setFormProject] = useState(project);
  const [docName, setDocName] = useState("");

  const docUrl = 'http://localhost:8080/api/auth/temp'

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
        doc: docName,
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

  const props = {
    action: docUrl,
    enctype: 'multipart/form-data',
    beforeUpload: (file) => {
      const isValidDocFormat =
        //check if file is pdf
        file.type === 'application/pdf'
      if (!isValidDocFormat) {
        message.error(
          `${file.name} this is not a supported format, please upload a pdf file`
        )
        return Upload.LIST_IGNORE
      }
      const isValidDocName = /^[\x20-\x7E]+$/.test(file.name);
      if (!isValidDocName) {
        message.error(
          `${file.name} this is not a supported name, please upload a pdf file with a name that contains only ascii characters`
        )
        return Upload.LIST_IGNORE
      }
    },
    listType: 'picture-card',
    maxCount: 1,
    accept: '.pdf',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        setDocName(info.file.name)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
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
          doc: formProject ? formProject.doc : '',
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
        <Form.Item name="doc" label="docoment">
          <Upload.Dragger {...props} name="temp">
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>drop here</div>
            </div>
          </Upload.Dragger>
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
