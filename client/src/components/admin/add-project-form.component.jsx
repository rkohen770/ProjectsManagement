import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import {
	Button,
	message,
	ColorPicker,
	Form,
	Input,
	Space,
	DatePicker,
} from 'antd'

ProjectForm.propTypes = {
	project: PropTypes.object,
	onSubmitSuccess: PropTypes.func.isRequired,
};
export function ProjectForm({ project, onSubmitSuccess }) {
	const [submitLoading, setSubmitLoading] = useState(false)

	const { App } = window
	const [form] = Form.useForm()

	const onFinish = async (values) => {
	}

	const onFinishFailed = (errorInfo) => {
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
					name: project ? project.name : 'new project',
					description: project ? project.description : '',
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
				<Form.Item name="deadline" label="deadline">
					<DatePicker/>
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
