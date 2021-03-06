import { Container } from "react-bootstrap";
import { Redirect, withRouter } from "react-router-dom";
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isLoggedIn: false,
      show_alert: false,
      alert_message: "",
      firstLogged: false,
    };
  }

  componentDidMount() {
    if (JSON.parse(localStorage.getItem("isLoggedIn"))) {
      this.setState({ isLoggedIn: true });
    }
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    const creadentials = {
      username: this.state.username,
      password: this.state.password,
    };
    try {
      const resp = await axios.post("/api/auth/signin", creadentials);

      if (resp.data.status) {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("@token", resp.data.accessToken);
        this.setState({ isLoggedIn: true, firstLogged: true });
      } else {
        this.setState({ show_alert: true, alert_message: resp.data.message });
      }
    } catch (err) {
      // Handle Error Here
      console.error(err.massage);
    }
  };

  renderRedirect = () => {
    if (this.state.firstLogged) {
      return (
        <Redirect
          to={{
            pathname: "/",
            state: { show_login_alert: true },
          }}
        />
      );
    }
    if (this.state.isLoggedIn) {
      console.log("user is logged in");
      return (
        <Redirect
          to={{
            pathname: "/profile",
            state: { show_login_alert: true },
          }}
        />
      );
    }
  };
  render() {
    return (
      <Container className="mt-2">
        <form onSubmit={this.handleSubmit}>
          <h3>Sign In</h3>
          {this.state.show_alert ? (
            <div className="alert alert-danger" role="alert">
              {this.state.alert_message}
            </div>
          ) : null}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              value={this.state.username}
              onChange={(e) => {
                this.setState({ username: e.target.value });
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={this.state.password}
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Submit
          </button>
          {this.renderRedirect()}
        </form>
        <Link to="/sign-up">
          <p className="m-1">Not got an account? Sign Up here</p>
        </Link>
      </Container>
    );
  }
}

export default withRouter(Login);
