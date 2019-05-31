import 'date-fns';
import React from 'react';
import { Grid, Button, TextField } from '@material-ui/core/';
import Web3 from 'web3'
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Header from './Header';
import Progress from './Progress';
import { getWeb3 } from '../utils/getWeb3';
import PiggyBank from '../PiggyBank.json';
import '../App.css';

declare global {
    interface Window {
        web3: Web3
    }
}

interface Props {}
interface State {
    date: Date | null,
    web3: any,
    accounts: string[],
    contract: any,
    value: string,
    pending: boolean
}

interface InputEvent extends React.FormEvent<HTMLInputElement> {
    target: HTMLInputElement;
}

class MaterialUIPickers extends React.Component<Props, State> {
  constructor(props: Props) {
      super(props);
      this.state = {
          date: new Date(),
          web3: null,
          accounts: [],
          contract: null,
          value: '',
          pending: false
      }
      this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidMount = async() => {
       const web3: any = await getWeb3();
       const accounts: string[] = await web3.eth.getAccounts();
       const networkId: string = await web3.eth.net.getId();
       const deployedNetwork: any = PiggyBank.networks[networkId];
       const contract: any = new web3.eth.Contract(
           PiggyBank.abi,
           deployedNetwork && deployedNetwork.address,
       );
       this.setState({ web3, accounts, contract });
  }
  

  handleDateChange(date: Date | null): void {
      this.setState({ date })
  }

  handleChange = (e: InputEvent) => {
    this.setState({value: e.target.value});
  };

  depositETH = async() => {
      const { web3, accounts, contract, date, value } = this.state;
      const now: Date = new Date();
      const current_unixtime: number = Math.floor(now.getTime()/1000);
      if(date !== null) {
        const period: number = Math.floor(date.getTime()/1000) - current_unixtime;
        if(period <= 0) {
            alert('現在より前の時刻は無効です')
        }
        console.log(typeof value);
        const depositWei: number = web3.utils.toWei(value);
        
        const result = await contract.methods.deposit(period).send({
            from: accounts[0],
            value: depositWei
        });
        if(result.status === true) {
            alert('送金が完了しました')
        } else {
            alert('エラーが発生しました')
        }
      }
  }

  render() {
    const { date, pending } = this.state;

    return (
        <div className="App">
        <Header/>
        { pending? <Progress/> : <p></p> }
        <h2>Deposit Form</h2>
        <br/>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>

            <Grid justify="center" container>
            <KeyboardDatePicker
             margin="normal"
             id="mui-pickers-date"
             label="Date picker"
             value={date}
             onChange={this.handleDateChange}
             KeyboardButtonProps={{
                'aria-label': 'change date',
             }}
            />
            </Grid>

            <Grid justify="center" container>
            <KeyboardTimePicker
             margin="normal"
             id="mui-pickers-time"
             label="Time picker"
             value={date}
             onChange={this.handleDateChange}
             KeyboardButtonProps={{
                'aria-label': 'change time',
             }}
             />
            </Grid>

            <Grid justify="center" container>
            <TextField
            id="outlined-name"
            label="ETH"
            onChange={this.handleChange}
            margin="normal"
            />
            </Grid>
            <br/>
            <Grid justify="center" container>
            <Button variant="outlined" color="secondary" onClick={this.depositETH} >
               Deposit
            </Button>
            </Grid>
        </MuiPickersUtilsProvider>
        </div>
    );
  }
}

export default MaterialUIPickers;
