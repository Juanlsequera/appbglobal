import React, { Component } from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Card } from "react-bootstrap";
import axios from "axios";
import Select from "@material-ui/core/Select";
import Avatar from "@material-ui/core/Avatar";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { Link, withRouter } from 'react-router-dom';
import {
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  Input,
  Button,
  Grid,
} from "@material-ui/core";

const urlApiVehicles = "http://localhost:59365/api/Vehicles/";
const urlApiBrands = "http://localhost:59365/api/Brands";
const urlApiOwners = "https://reqres.in/api/users?page=%7bp%C3%A1gina%7d";

const Placeholder = ({ children }) => {
  const classes = usePlaceholderStyles();
  return <div className={classes.placeholder}>{children}</div>;
};

const usePlaceholderStyles = makeStyles((theme) => ({
  placeholder: {
    color: "#aaa",
  },
}));

const createTitle = "Create a vehicle";
const editTitle = "Edit vehicle";

class Form extends Component {
  state = {
    brands: [],
    owners: [],
    form: {
      id: "",
      patent: "",
      owner: "",
      brand: "",
      doors: "",
      model: "",
      brandId: "",
    },
  };

  buildData = () => {
    const { brand, owner, model, doors, patent, id } = this.state.form;
    const data = {
      id: id,
      patent: patent,
      owner: owner.toString(),
      doors: doors,
      model: model,
      brandId: brand.toString(),
    };
    return data;
  };

  goToIndex = () => {
    window.location.replace('/');
  }

  GetBrands = async () => {
    await axios.get(urlApiBrands).then((response) => {
      this.setState({ brands: response.data });
    })
      .catch((error) => {
        console.log(error.message);
      });
  };

  GetOwners = async () => {
    await axios.get(urlApiOwners).then((response) => {
      this.setState({ owners: response.data.data });
    })
      .catch((error) => {
        console.log(error.message);
      });
  };

  PostData = async () => {
    const data = this.buildData();
    delete data.brand;
    delete data.brands;
    delete data.id;
    await axios.post(urlApiVehicles, data).then((response) => {
      if (response.status === 200) {
        this.goToIndex();
      }
    })
      .catch((error) => {
        console.log(error.message);
      });
  };

  PutData = async () => {
    const data = this.buildData();
    delete data.brand;
    delete data.brands;
    await axios.put(urlApiVehicles + this.state.form.id, data).then((response) => {
      if (response.status === 200) {
        this.goToIndex();
      }
    })
      .catch((error) => {
        console.log(error.message);
      });
  };

  GetVehicle = async (id) => {
    await axios.get(urlApiVehicles + id).then((response) => {
      this.setFormValuesToEdit(response.data);
    })
      .catch((error) => {
        console.log(error.message);
      });
  }

  setFormValuesToEdit = (dataToEdit) => {
    const { brandId, owner, model, doors, patent, id } = dataToEdit;
    const formEdit = {
      id: id.toString(),
      patent: patent,
      owner: owner.toString(),
      doors: doors,
      model: model,
      brand: brandId.toString(),
      brandId: "",
    };

    this.setState({
      form: formEdit,
    });
  };

  componentDidMount() {
    const { location, match } = this.props;
    if (location.pathname.includes("Edit")) {
      this.GetVehicle(match.params.id);
    }
    this.GetBrands();
    this.GetOwners();
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

  validateInputs = () => {
    const { form } = this.state;
    const { owner, model, doors, patent, brand } = form;

    let error = 0;
    const formValidate = {
      patent: patent,
      owner: owner.toString(),
      doors: doors,
      model: model,
      brand: brand.toString(),
    };

    Object.keys(formValidate).map(function (key) {
      const value = formValidate[key];
      if (value === "") {
        error++;
      }
    });
    return error !== 0;
  }

  render() {

    const { owners, brands, form } = this.state;
    const { location: { pathname } } = this.props;
    const hasErrorOnForm = this.validateInputs();

    return (
      <Card>
        <Card.Body>
          <Container>
            <Card.Title>Vehicles</Card.Title>
            <Card.Subtitle>{pathname.includes("Create") ? createTitle : editTitle}</Card.Subtitle>
            <Grid container>
              <Grid item md={12}>
                <FormControl error={form.patent === ""}>
                  <InputLabel htmlFor="patent">Patent</InputLabel>
                  <Input
                    name="patent"
                    aria-describedby="patent-helper"
                    onChange={this.handleChange}
                    value={form.patent}
                    error={form.patent === ""}
                  />
                  <FormHelperText name="patent-helper">
                    Enter patent
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={12}>
                <FormControl error={form.brand === ""}>
                  <Select
                    name="brand"
                    labelWidth={50}
                    onChange={this.handleChange}
                    value={form.brand}
                    displayEmpty
                    renderValue={
                      this.state.form.brand === ""
                        ? () => <Placeholder>Select Brand</Placeholder>
                        : undefined
                    }
                  >
                    <MenuItem value="">Select brand</MenuItem>
                    {brands.map((brands) => (
                      <MenuItem value={brands.id}>{brands.name}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText name="patent-helper">Select Brand</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={12}>
                <FormControl error={form.model === ""}>
                  <InputLabel htmlFor="model">Model</InputLabel>
                  <Input
                    name="model"
                    aria-describedby="model-helper"
                    onChange={this.handleChange}
                    value={form.model}
                  />
                  <FormHelperText name="model-helper">
                    Select a Vehicle Model
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={12}>
                <FormControl error={form.doors === ""}>
                  <InputLabel htmlFor="doors">Doors</InputLabel>
                  <Input
                    name="doors"
                    aria-describedby="doors-helper"
                    onChange={this.handleChange}
                    value={form.doors}
                  />
                  <FormHelperText name="doors-helper">
                    Enter number of doors
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={12}>
                <FormControl error={form.owner === ""}>
                  <Select
                    name="owner"
                    labelWidth={100}
                    onChange={this.handleChange}
                    value={form.owner}
                    displayEmpty
                    renderValue={
                      this.state.form.owner === ""
                        ? () => <Placeholder>Select Owner</Placeholder>
                        : undefined
                    }
                  >
                    <MenuItem value="">Select Owner</MenuItem>
                    {owners.map((owners) => (
                      <MenuItem value={owners.id}>
                        <Avatar src={owners.avatar} />
                        {owners.first_name} {owners.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText name="patent-helper">Select Owner</FormHelperText>
                </FormControl>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  onClick={pathname.includes("Create") ? this.PostData : this.PutData}
                  disabled={hasErrorOnForm}
                >
                  Send
              </Button>
              </Grid>
            </Grid>
            <br></br>
            <Link onClick={this.goToIndex}>Back</Link>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}
export default withRouter(Form);