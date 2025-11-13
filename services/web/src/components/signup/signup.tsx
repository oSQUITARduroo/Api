/*
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Button, Form, Input, Card } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EMAIL_REQUIRED,
  NAME_REQUIRED,
  INVALID_PHONE,
  PASSWORD_REQUIRED,
  CONFIRM_PASSWORD,
  PASSWORD_DO_NOT_MATCH,
  INVALID_PASSWORD,
  MECHANIC_CODE_REQUIRED,
} from "../../constants/messages";
import {
  EMAIL_VALIDATION,
  NAME_VALIDATION,
  PHONE_VALIDATION,
  PASSWORD_VALIDATION,
  MECHANIC_CODE_VALIDATION,
} from "../../constants/constants";
import "./signup.css";

interface SignupProps {
  hasErrored: boolean;
  errorMessage: string;
  onFinish: (values: any) => void;
  onMechanicFinish: (values: any) => void;
}

type UserType = "user" | "mechanic";

const Signup: React.FC<SignupProps> = ({
  hasErrored = false,
  errorMessage = "",
  onFinish,
  onMechanicFinish,
}) => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>("user");

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
  };
  const handleFormSubmit = (values: any) => {
    if (userType === "user") {
      onFinish(values);
    } else {
      onMechanicFinish(values);
    }
  };

  return (
    <div className="container">
      <Card title="Sign Up" bordered={false} className="form-card">
        <div className="user-type-toggle">
          <button
            type="button"
            className={`toggle-button ${userType === "user" ? "active" : ""}`}
            onClick={() => handleUserTypeChange("user")}
          >
            User
          </button>
          <button
            type="button"
            className={`toggle-button ${userType === "mechanic" ? "active" : ""}`}
            onClick={() => handleUserTypeChange("mechanic")}
          >
            Mechanic
          </button>
        </div>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: NAME_REQUIRED },
              {
                pattern: NAME_VALIDATION,
                message: NAME_REQUIRED,
              },
            ]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: EMAIL_REQUIRED },
              {
                pattern: EMAIL_VALIDATION,
                message: EMAIL_REQUIRED,
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="number"
            rules={[
              {
                pattern: PHONE_VALIDATION,
                message: INVALID_PHONE,
              },
            ]}
          >
            <Input placeholder="Phone No." />
          </Form.Item>
          {userType === "mechanic" && (
            <Form.Item
              name="mechanic_code"
              rules={[
                { required: true, message: MECHANIC_CODE_REQUIRED },
                {
                  pattern: MECHANIC_CODE_VALIDATION,
                  message: MECHANIC_CODE_REQUIRED,
                },
              ]}
            >
              <Input placeholder="Mechanic Code" />
            </Form.Item>
          )}
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: PASSWORD_REQUIRED,
              },
              {
                pattern: PASSWORD_VALIDATION,
                message: INVALID_PASSWORD,
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="againPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: CONFIRM_PASSWORD,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(PASSWORD_DO_NOT_MATCH));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Re-enter Password" />
          </Form.Item>
          <Form.Item>
            <button
              className="alternative-style"
              onClick={() => navigate("/login")}
              type="button"
            >
              Already have an Account? Login
            </button>
            {hasErrored && <div className="error-message">{errorMessage}</div>}
            <Button type="primary" htmlType="submit" className="form-button">
              Signup
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;
