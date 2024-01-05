import React, { useState, useEffect } from 'react';
import { List, Card } from 'antd'
import UserService from '../services/user.service'; // Assuming UserService is imported from here
const data = [
  {
    title: 'Title 1',
  },
  {
    title: 'Title 2',
  },
  {
    title: 'Title 3',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 5',
  },
  {
    title: 'Title 6',
  },
];
export default function BoardAdmin() {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getAdminBoard().then(
      response => {
        setContent(response.data);
      },
      error => {
        setContent(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        );
      }
    );
  }, []); // Empty array means this effect runs once on mount, similar to componentDidMount

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
      <body>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Card title={item.title}>Card content</Card>
            </List.Item>
          )}
        />
      </body>
    </div>
  );
}
