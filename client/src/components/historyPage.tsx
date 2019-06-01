import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import '../App.css';
import Header from './Header';
import { Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, 
         Button, Dialog, DialogActions, DialogContent} from '@material-ui/core/';
import { getWeb3 } from '../utils/getWeb3';
import PiggyBank from '../PiggyBank.json';

interface Props {}
interface State {
    web3: any,
    accounts: string[],
    contract: any,
    data: any,
    open: boolean,
    date: Date | null,
    id: number | null,
    previous_period: number | null
}

interface Json {
    id: number,
    amount: number,
    period: number,
    finished: boolean
}

class HistoryPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            web3: null,
            accounts: [],
            contract: null,
            data: [],
            open: false,
            date: new Date(),
            id: null,
            previous_period: null
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
        this.viewAllDeposit();
    }

    handleOpen = (id: number, unixtime: number): void => {
        this.setState({ open: true, id: id,  previous_period: unixtime });
    }

    handleClose = (): void => {
        this.setState({ open: false });
    };

    handleDateChange(date: Date | null): void {
        this.setState({ date })
    }  

    viewAllDeposit = async() => {
        const { contract, accounts, web3 } = this.state;
        const address: string = accounts[0];
        const isExist: boolean = await contract.methods.isUserExist(address).call();
        if(!isExist) { return; }
        const depositNumber = await contract.methods.userTotalDeposit(address).call();
        const idepositNumber: number = web3.utils.hexToNumber(depositNumber._hex);
        for(var i: number = 0; i < idepositNumber; i++) {
            const result = await contract.methods.userToDeposit(address, i + 1).call();
            const withdrawed: boolean = result.withdrawed;
            if(withdrawed) {
                continue;
            }
            const amount: number = parseInt(result.amount._hex, 16) / 1000000000000000000;
            const period: number = web3.utils.hexToNumber(result.period._hex);
            const now: Date = new Date();
            const current_unixtime: number = Math.floor(now.getTime()/1000);
            let json: Json;

            if(current_unixtime > period) {
                json = {id: i+1, amount: amount, period: period, finished: true};
            } else {
                json = {id: i+1, amount: amount, period: period, finished: false};
            }
            this.setState({ data: this.state.data.concat(json)});
            console.log(result);
        }
        console.log(this.state.data)
    }

    unixTimeToTime = (time: number):string => {
        const y: Date = new Date(time * 1000);
        const year: number = y.getFullYear();
        const month: number = y.getMonth() + 1;
        const day: number = y.getDate();
        const hour: string = ('0' + y.getHours()).slice(-2);
        const min: string = ('0' + y.getMinutes()).slice(-2);
        const sec: string = ('0' + y.getSeconds()).slice(-2);
        const Time: string = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
        return Time;
    }

    withdraw = async(id: number) => {
        const { contract, accounts } = this.state;
        const result: any = await contract.methods.withdraw(id).send({
            from: accounts[0]
        })
        console.log(result);
    }

    extendPeriod = async() => {
        const { contract, accounts, id, date, previous_period } = this.state;
        if(date !== null && previous_period !== null) {
            const period: number = Math.floor(date.getTime()/1000) - previous_period;
            if(period <= 0) {
                alert('You can only extend the period.');
                return;
            }
            const result: any = await contract.methods.extendPeriod(period, id).send({
              from: accounts[0]
            })
            console.log(result);
        }
    }

    renderDeposit() {
        return(
            <React.Fragment>
                  <Paper>
                      <Table>
                          <TableHead>
                              <TableRow>
                                <TableCell align="left">id</TableCell>
                                <TableCell align="left">value(ETH)</TableCell>
                                <TableCell align="left">period</TableCell>
                                <TableCell align="left"></TableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              {this.state.data.map((deposit:Json, i: number) => (
                                  <TableRow key={i}>
                                    <TableCell align="left">{deposit.id}</TableCell>
                                    <TableCell align="left">{deposit.amount}</TableCell>
                                    <TableCell align="left">{this.unixTimeToTime(deposit.period)}</TableCell>
                                    <TableCell align="left">{deposit.finished? <Button variant="outlined" color="primary" onClick={() => {this.withdraw(deposit.id)}}>withdraw</Button> : <Button variant="outlined" color="secondary" onClick={() => this.handleOpen(deposit.id, deposit.period)}>extend</Button>}</TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </Paper>
                  <Dialog
                   open={this.state.open}
                   onClose={this.handleClose}
                  >
                    <DialogContent>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>

                        <Grid justify="center" container>
                        <KeyboardDatePicker
                         margin="normal"
                         id="mui-pickers-date"
                         label="Date picker"
                         value={this.state.date}
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
                         value={this.state.date}
                         onChange={this.handleDateChange}
                         KeyboardButtonProps={{
                         'aria-label': 'change time',
                        }}
                        />
                        </Grid>

                        <div className="center">
                            <Button variant="outlined" color="primary" onClick={() => this.extendPeriod()} >
                                extend
                            </Button>
                        </div>
                        </MuiPickersUtilsProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>
                            close
                        </Button>
                    </DialogActions>
                  </Dialog>
            </React.Fragment>
        );
    }

    render() {
        return(
            <div className="App">
              <Header />
              <h2>History</h2>
              <Grid justify="center" container>
              <Grid item xs={12} sm={12} md={6}>
                {this.renderDeposit()}
              </Grid>
              </Grid>
            </div>
        );
    }
}

export default HistoryPage;