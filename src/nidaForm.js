import React, { Component } from "react";
import {
  Button,
  TextInputField,
  Heading,
  Pane,
  Text,
  Spinner,
  Avatar,
} from "evergreen-ui";
import axios from "axios";
class NidaForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nid: "",
      info: {},
      forename: "",
      sirnames: "",
      dob: "",
      img_url: "",
      province: "",
      district: "",
      sector: "",
      village: "",
      cell: "",
      gender: "",
      place_of_issue: "",
      data_fetched: false,
      fetching: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    // console.log(e.target.value);
    this.setState({
      nid: e.target.value,
    });
  }

  handleSubmit() {
    // console.log(this.state.nid);
    this.setState({
      data_fetched: false,
      fetching: true,
    });
    let nid = this.state.nid;
    let code = "103";
    axios
      .get("http://localhost:3500/api/?doc=" + nid + "&code=" + code)
      // .get("https://nida-node.herokuapp.com/?doc=" + nid + "&code=" + code)
      .then((d) => {
        console.log(d);

        if (d.data.result !== null) {
          if (d.data.result.AuthenticateDocumentResult !== null) {
            this.setState({
              forename: d.data.result.AuthenticateDocumentResult.ForeName,
              sirnames: d.data.result.AuthenticateDocumentResult.Surnames,
              dob: d.data.result.AuthenticateDocumentResult.DateOfBirth,
              img_url: d.data.result.Photo,
              province: d.data.result.Province,
              district: d.data.result.District,
              sector: d.data.result.Sector,
              village: d.data.result.Village,
              cell: d.data.result.Cell,
              gender: d.data.result.Sex,
              place_of_issue: d.data.result.Photo,
              data_fetched: true,
              fetching: false,
              info: d.data.result.AuthenticateDocumentResult,
            });
          }
        } else {
          this.setState({
            forename: "-",
            sirnames: "-",
            dob: "-",
            img_url: "-",
            province: "-",
            district: "-",
            sector: "-",
            village: "-",
            cell: "-",
            gender: "-",
            data_fetched: true,
            fetching: false,
            info: d.data.result.AuthenticateDocumentResult,
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);

          this.setState({
            fetching: false,
            con_error: true,
            con_error_text: error.response.data,
          });
        }
      });
  }

  render() {
    return (
      <React.Fragment>
        <Pane
          display="flex"
          width={600}
          padding={16}
          marginTop={50}
          marginLeft={50}
          background="tint2"
          borderRadius={3}
        >
          <Pane flex={1} alignItems="center">
            <TextInputField
              label="Enter the NID"
              name="nid"
              value={this.state.nid}
              placeholder="1198009..."
              height={24}
              width={160}
              marginRight={16}
              onChange={this.handleChange}
            />
            <br></br>
            <Button type="submit" onClick={this.handleSubmit}>
              Submit
            </Button>
          </Pane>

          {this.state.fetching && (
            <Pane flex={1} height={30}>
              <Spinner delay={300} />
            </Pane>
          )}

          {this.state.data_fetched && (
            <div>
              <Pane>
                <Text size={300}>Forename: {this.state.forename}</Text>
                <br />
                <Text size={300}>Surnames: {this.state.sirnames}</Text>
                <br />
                <Text size={300}>Date Of Birth: {this.state.dob}</Text>
                <br />
                <Text size={300}>Province: {this.state.province}</Text>
                <br />
                <Text size={300}>District: {this.state.district}</Text>
                <br />
                <Text size={300}>Sector: {this.state.sector}</Text>
                <br />
                <Text size={300}>Village: {this.state.village}</Text>
                <br />
                <Text size={300}>Gender: {this.state.gender}</Text>
                <br />
                <Text size={300}>
                  Place of issue: {this.state.place_of_issue}
                </Text>
                <br />
              </Pane>
              <Pane>
                <Avatar
                  src={this.state.img_url}
                  name={this.state.forename + " " + this.state.sirnames}
                  size={100}
                />
              </Pane>
            </div>
          )}

          {this.state.con_error && (
            <Pane>
              <Text size={300}>{this.state.con_error_text}</Text>
            </Pane>
          )}
        </Pane>
      </React.Fragment>
    );
  }
}

export default NidaForm;
