import React from 'react';
import '../App.css';
import Header from './Header';
import { Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button} from '@material-ui/core/';
import { getWeb3 } from '../utils/getWeb3';
import PiggyBank from '../PiggyBank.json';
import { JsonRpcMapper } from 'web3-providers';

interface Props {}
interface State {
    web3: any,
    accounts: string[],
    contract: any,
    data: any
}

interface Json {
    id: number,
    amount: number,
    period: string,
    finished: boolean
}

class HistoryPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            web3: null,
            accounts: [],
            contract: null,
            data: []
        }
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

    viewAllDeposit = async() => {
        const { contract, accounts, web3 } = this.state;
        const address: string = accounts[0];
        const isExist: boolean = await contract.methods.isUserExist(address).call();
        if(!isExist) { return; }
        const depositNumber = await contract.methods.userTotalDeposit(address).call();
        const idepositNumber: number = web3.utils.hexToNumber(depositNumber._hex);
        for(var i: number = 0; i < idepositNumber; i++) {
            const result = await contract.methods.userToDeposit(address, i + 1).call();
            const amount: number = parseInt(result.amount._hex, 16) / 1000000000000000000;
            const period: number = web3.utils.hexToNumber(result.period._hex);
            const date: string = this.unixTimeToTime(period);
            const now: Date = new Date();
            const current_unixtime: number = Math.floor(now.getTime()/1000);
            let json: Json;
            if(current_unixtime > period) {
                json = {id: i+1, amount: amount, period: date, finished: true};
            } else {
                json = {id: i+1, amount: amount, period: date, finished: false};
            }
            this.setState({ data: this.state.data.concat(json)});
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

    renderDeposit() {
        return(
            <React.Fragment>
                  <Paper>
                      <Table>
                          <TableHead>
                              <TableRow>
                                <TableCell align="left">id</TableCell>
                                <TableCell align="left">金額(ETH)</TableCell>
                                <TableCell align="left">期限</TableCell>
                                <TableCell align="left"></TableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              {this.state.data.map((deposit:Json, i: number) => (
                                  <TableRow key={i}>
                                    <TableCell align="left">{deposit.id}</TableCell>
                                    <TableCell align="left">{deposit.amount}</TableCell>
                                    <TableCell align="left">{deposit.period}</TableCell>
                                    <TableCell align="left">{ deposit.finished? <Button variant="outlined" color="primary" onClick={() => {this.withdraw(deposit.id)}}>withdraw</Button> : <Button variant="outlined" color="secondary">extend</Button>}</TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </Paper>
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