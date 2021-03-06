import React, { Component } from 'react'
import { addTaskToFirebase, removeTaskFromFirebase } from '../../firebase'
import AddButton from './AddButton.jsx'
import { Button, Table, Divider } from 'antd'
import {
  getTasksThunk,
  watchTaskAddedEvent,
  watchTaskRemovedEvent,
  getUsersThunk,
  selectRow,
} from '../../store/gameboard/actions'
import { connect } from 'react-redux'
import { Input, InputNumber, Popconfirm, Form } from 'antd'
import Auth from '../auth/auth'
import Edit from './EditButton.jsx'

class DataTable extends Component {
  componentDidMount() {
    this.props.dispatch(getTasksThunk())
    this.props.dispatch(getUsersThunk())
    // TODO: Recheck below
    watchTaskRemovedEvent(this.props.dispatch)
    watchTaskAddedEvent(this.props.dispatch)
  }
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />
    }
    return <Input />
  }

  checkUser = () => {
    if (this.props.users[0] && this.props.users[0].id) {
      let name = localStorage.getItem('myName')
      let buff = this.props.users.find(item => item.id === name)
      return buff
    }
  }
  columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Daily plan',
      dataIndex: 'dailyPlan',
      key: 'dailyPlan',
    },
    {
      title: 'Future plan',
      dataIndex: 'futurePlan',
      key: 'futurePlan',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Tottaly worked',
      dataIndex: 'TottalyWorked',
      key: 'TottalyWorked',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:void(0);" onClick={() => this.props.dispatch(selectRow(record))}>
            Change
          </a>
          <Divider type="vertical" />
          <a href="javascript:void(0);" onClick={() => removeTaskFromFirebase(record.key)}>
            Delete
          </a>
        </span>
      ),
    },
  ]
  renderContent = () => {
    if (this.checkUser() == null) {
      return <Auth style={{ marginLeft: 8 }} />
    } else {
      return (
        <div>
          <Edit onClick={addTaskToFirebase} />
          <Table columns={this.columns} dataSource={(this.props.tasks || []).map(i => i.task)} />
          <AddButton onClick={addTaskToFirebase} />
        </div>
      )
    }
  }
  render() {
    // TODO: Add edit/delete of plans
    return <div>{this.renderContent()}</div>
  }
}

const mapState = state => ({
  // debugger

  Row: state,
  tasks: state.tasks,
  users: state.Users,
})

export default connect(mapState)(DataTable)
