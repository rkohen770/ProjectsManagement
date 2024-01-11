import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Upload, Card, Button, Image, Space, Descriptions, Divider, Modal, Form, message, Input } from "antd";
import { UserOutlined, MailOutlined, TagOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import { UserContext } from "../../context/user.context";
export function Profile() {

  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [load, setLoad] = useState(true);

  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [form] = Form.useForm();


  useEffect(() => {
    async function fetchData() {
      const user = await AuthService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setAvatar(user.avatar);
        setUserReady(true);
      } else {
        setRedirect('/login');
      }
    }
    fetchData();
  }, [setCurrentUser, load]);

  if (redirect) {
    return <Navigate to={redirect} />
  }

  const fetchUpdateData = async () => {

    const response = await UserService.getUserById(currentUser.id);
    if (response.status === 200) {
      setCurrentUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    else {
      console.log(response.message);
      message.error(response.message);
    }
    setLoad(!load);
  }

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true)
      const newUserData = {
        userName: values.userName,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        avatar: avatar
      }
      const response = await AuthService.updateUser(currentUser.id, newUserData)
      if (response.status === 200) {
        message.success('the user has been updated successfully!')
        setIsModalVisible(false);
        fetchUpdateData()
      } else {
        message.error(response.message)
      }
    } catch (error) {
      console.log(error)
      message.error('an error has occurred while you were trying to update the user')
    } finally {
      setSubmitLoading(false)
    }
  }

  const props = {
    action: "http://localhost:8080/api/auth/temp",
    enctype: "multipart/form-data",
    method: "post",
    beforeUpload: (file) => {
      const isValidImageFormat =
        //check if file is an image
        file.type === 'image/png' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg'
      if (!isValidImageFormat) {
        message.error(
          `${file.name} this is not a supported format, please upload a png, jpeg or jpg file`
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
    listType: 'picture-circle',
    maxCount: 1,
    accept: '.png,.jpeg,.jpg',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        setAvatar(info.file.name)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  }

  const handleEdit = () => {
    form.setFieldsValue({ currentUser })
    setIsModalVisible(true);
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="container">
        {userReady ?
          <div>
            <Card
              bordered
              style={{ width: 400, margin: 'auto', marginBottom: '20px' }}
              cover={<Image src={currentUser.avatar} />}
              actions={[<EditOutlined key="edit" onClick={() => handleEdit()} />]}
            >
              <div className="site-card-border-less-wrapper">
                <div>
                  <Divider orientation="left">{<UserOutlined />}</Divider>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Descriptions size="small" column={1} items={[{ label: 'Name', children: currentUser.firstName }]} />
                    <Descriptions size="small" column={1} items={[{ label: 'Surname', children: currentUser.lastName }]} />
                  </div>
                </div>

                <Divider orientation="left">{<MailOutlined />}</Divider>
                <Descriptions size="small" column={1} items={[{ label: 'Email', children: currentUser.email }]} />

                <Divider orientation="left">{<TagOutlined />}</Divider>
                <Descriptions size="small" column={1} items={[{ label: 'Role', children: currentUser.role }]} />
              </div>
            </Card>
          </div> : null}
        <Modal
          title="Edit profile"
          footer={null}
          closable={true}
          open={isModalVisible}
          destroyOnClose={true}
          width={400}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form
            form={form}
            name="edit-profile-form"
            onFinish={onFinish}
            onFinishFailed={() => message.error('an error has occurred while you were trying to update the user')}
            initialValues={{
              userName: currentUser?.userName,
              firstName: currentUser?.firstName,
              lastName: currentUser?.lastName,
              email: currentUser?.email,
            }}
          >
            <Form.Item name="userName" label="Username" >
              <Input />
            </Form.Item>
            <Form.Item name="firstName" label="First Name" >
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" >
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" >
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Password" >
              <Input.Password />
            </Form.Item>
            <Form.Item name="avatar" label="Avatar" >
              <Upload.Dragger {...props} name="temp">
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>drop here</div>
              </Upload.Dragger>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitLoading} style={{ width: '100%' }}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </UserContext.Provider>
  );
}