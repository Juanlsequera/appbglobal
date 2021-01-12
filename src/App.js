import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';
import MaterialTable from "material-table";
import { Button } from '@material-ui/core';
import { Edit, DeleteOutline } from "@material-ui/icons";
import { withRouter } from 'react-router-dom';

const columns = [
  {
    title: "Name",
    field: "brands.name"
  },
  {
    title: "Model",
    field: "model"
  },
  {
    title: "Patent",
    field: "patent"
  },
  {
    title: "Doors",
    field: "doors"
  }
];

const urlApiVehicles = "http://localhost:59365/api/Vehicles/";
class App extends Component {

  state = {
    vehicleList: []
  };

  GetAll = async () => {
    await axios.get(urlApiVehicles).then(response => {
      this.setState({ vehicleList: response.data });
    }).catch(error => {
      console.log(error.message);
    });
  }

  DeleteVehicle = async (id) => {
    await axios.delete(urlApiVehicles + id).then((response) => {
      if (response.status === 200) {
        this.setState({ vehicleList: [] });
        this.GetAll();
      }
    })
      .catch((error) => {
        console.log(error.message);
      });
  };

  componentDidMount() {
    this.GetAll();
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      },
    });
  };

  goToCreate = () => {
    window.location.replace('/Create')
  }

  goToEdit = (id) => {
    window.location.replace('/Edit/' + id)
  }

  render() {

    const { vehicleList } = this.state;

    return (
      <div className="AppBglobal">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
        <br />
        <Button variant="contained" color="secondary" onClick={this.goToCreate}> Create Vehicle</Button>
        <br /><br />
        <MaterialTable
          columns={columns}
          actions={[
            rowData => ({
              icon: Edit,
              tooltip: 'Edit Vehicle',
              onClick: (event, rowData) =>
                this.goToEdit(rowData.id)
            }),
            rowData => ({
              icon: DeleteOutline,
              tooltip: 'Delete Vehicle',
              onClick: (event, rowData) => {
                if (window.confirm('¿Do you want to delete this vehicle?')) {
                  this.DeleteVehicle(rowData.id)
                }
              }
            })
          ]}
          data={vehicleList}
          title="Vehicles"
        />
      </div>
    );
  }
}
export default withRouter(App);

