import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import GitHub from 'github-api';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class App extends Component {
  state = {
    repositories: [],
    selectedRepository: '',
    title: '',
    body: '',
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  submit = () => {
    const user = this.state.selectedRepository.split('/')[0];
    const repo = this.state.selectedRepository.split('/')[1];
    const issue = this.gh.getIssues(user, repo);
    const {title, body} = this.state;
    issue.createIssue({
      title,
      body,
    }).then(console.log).catch(window.alert);
  }

  componentDidMount() {
    // basic auth
    this.gh = new GitHub({
      token: this.props.token,
    });

    const user = this.gh.getUser();
    user.listRepos().then(({data}) => data.map(d => d.full_name)).then(repositories => this.setState({repositories}))
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div style={{padding: '20px'}}>
          <Typography variant="body2" color="inherit">
            Save your thoughts straight to your Github repositories issues.
          </Typography>
          <div className={classes.root}>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel htmlFor="selectedRepository-simple">Select Repo</InputLabel>
              <Select
                value={this.state.selectedRepository}
                onChange={this.handleChange}
                inputProps={{
                  name: 'selectedRepository',
                  id: 'selectedRepository-simple',
                }}
              >
                {this.state.repositories.map((repo, index) => <MenuItem key={index} value={repo}>{repo}</MenuItem>)}
              </Select>
              <FormHelperText>The repository to post the issue to.</FormHelperText>
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
              <TextField
                id="filled-title"
                label="Issue Title"
                name="title"
                value={this.state.title}
                onChange={this.handleChange}
                margin="normal"
                variant="filled"
              />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
              <TextField
                id="filled-multiline-flexible"
                label="Issue Body"
                name="body"
                multiline
                rows="8"
                value={this.state.body}
                onChange={this.handleChange}
                margin="normal"
                helperText="Markdown to fill the issue with"
                variant="filled"
              />
            </FormControl>
            <Button onClick={this.submit} fullWidth variant="contained" color="primary" className={classes.button}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

export default withStyles(styles)(App);
