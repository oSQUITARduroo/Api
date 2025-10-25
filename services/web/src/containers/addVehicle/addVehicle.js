/*
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal } from "antd";
import { createVehicleAction, verifyVehicleAction } from "../../actions/vehicleActions";
import AddVehicle from "../../components/addVehicle/addVehicle";
import responseTypes from "../../constants/responseTypes";
import { SUCCESS_MESSAGE } from "../../constants/messages";
import { useNavigate } from "react-router-dom";

const AddVehicleContainer = (props) => {
  const navigate = useNavigate();
  const { createVehicle, verifyVehicle } = props;
  const { accessToken } = props;

  const [hasErrored, setHasErrored] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [vehicleCreated, setVehicleCreated] = React.useState(0);
  const [creationMessage, setCreationMessage] = React.useState("");

  const onCreateVehicle = () => {
    setVehicleCreated(1);
    const callback = (res, data) => {
      if (res === responseTypes.SUCCESS) {
        setVehicleCreated(2);
        setCreationMessage(data);
      } else {
        setVehicleCreated(0);
        setCreationMessage(data);
      }
    };
    createVehicle({ callback, accessToken });
  };

  const onFinish = (values) => {
    const callback = (res, data) => {
      if (res === responseTypes.SUCCESS) {
        Modal.success({
          title: SUCCESS_MESSAGE,
          content: data,
          onOk: () => navigate("/dashboard"),
        });
      } else {
        setHasErrored(true);
        setErrorMessage(data);
      }
    };
    verifyVehicle({
      callback,
      accessToken,
      ...values,
    });
  };

  return (
    <AddVehicle
      onFinish={onFinish}
      hasErrored={hasErrored}
      errorMessage={errorMessage}
      onCreateVehicle={onCreateVehicle}
      vehicleCreated={vehicleCreated}
      creationMessage={creationMessage}
    />
  );
};

const mapStateToProps = ({ userReducer: { accessToken } }) => {
  return { accessToken };
};

const mapDispatchToProps = {
  createVehicle: createVehicleAction,
  verifyVehicle: verifyVehicleAction,
};

AddVehicleContainer.propTypes = {
  accessToken: PropTypes.string,
  createVehicle: PropTypes.func,
  verifyVehicle: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddVehicleContainer);
