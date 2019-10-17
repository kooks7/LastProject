import React from 'react';
import TimeLog from './timelog';
import Admin from './admin';
import axios from 'axios';
import './App.css';
import userPng from './user.png'
import filePng from './file.png'
import padlockPng from './padlock.png'
import beliefPng from './belief.png'

class App extends React.Component {
  state = {
    isLogin: true,
    isTimeLog: false,
    isAdmin: false,
    login: false,
    name: '',
    admin: '',
    id: '',
    pw: '',
    Timelogs: [],
    total: 0,
    dept: '',
    FinalResultArr: []
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      id: e.target.value,
    });
  };
  pwChange = (e) => {
    e.preventDefault();
    this.setState({
      pw: e.target.value,
    });
  };

  pushLogin = (e) => {
    this.login();
    this.TimeLog();
    e.preventDefault();
  }
  isLogin = () => {
    this.setState({ isLogin: true, isTimeLog: false, isAdmin: false })
  }
  isTimeLog = () => {
    this.setState({ isLogin: false, isTimeLog: true, isAdmin: false })
  }
  isAdminTimeLog = () => {
    this.setState({ isLogin: false, isTimeLog: true, isAdmin: true })
  }
  isAdmin = () => {
    this.setState({ isLogin: false, isTimeLog: false, isAdmin: true, login: true })
  }

  login = async () => {
    const {
      data: {
        name,
        admin,
        dept
      }
    }
      = await axios.get('http://localhost:9000/login', {
        params: {
          id: this.state.id,
          pw: this.state.pw,
        }
      })
    await console.log("영찬아 함봐라11:",name, admin,dept, this.state.isAdmin);
    await this.setState({ isLogin: false, isTimeLog: true, isAdmin: admin, admin, login: true, name, dept })
    await console.log("영찬아 함봐라12:",name, admin,dept, this.state.isAdmin);
  }


  Logout = () => {
    this.setState({ isLogin: true, isTimeLog: false, isAdmin: false, login: false })
  }

  TimeLog = async () => {
    const {
      data: {
        totalArr,
        total
      }
    }
      = await axios.get('http://localhost:9000/timelogs', {
        params: {
          id: this.state.id
        }
      })
    await console.log("이거 나와라!!!!",totalArr);
    await this.setState({ Timelogs: totalArr, total })

  }

  Admin = async () => {
    this.isAdmin();

    await console.log("영찬아 함봐라222:",this.state.name, this.state.admin,this.state.dept, this.state.isAdmin);
    await console.log(this.state.FinalResultArr);

    const {
      data: {
        FinalResultArr
      }
    }
      = await axios.get('http://localhost:9000/admins', {
                params: {
                  dept: this.state.dept,
                  admin: this.state.isAdmin,
                  id: this.state.id
               }
      })
    await console.log("12313123", FinalResultArr);
    await this.setState({ FinalResultArr })
    await console.log("12313123", this.state.FinalResultArr);
  }


  render() {
    const { isLogin, isTimeLog, isAdmin, login, Timelogs, FinalResultArr } = this.state;
    return (
      <div className="App">
        <div className="sidebar">
          <ul className="logo">
            <li><p className="logo"><img className="logo" src={beliefPng} alt=""/><p className="logotext">Belief</p></p></li>
          </ul>
          {login ?
            isAdmin ?
                <ul className="sidenav">
                  <li><p onClick={this.Logout}><img src={userPng} alt=""/>로그아웃</p></li>
                  <li><p onClick={this.isAdminTimeLog}><img src={filePng} alt=""/>근태기록</p></li>
                  <li><p onClick={this.Admin}><img src={padlockPng} alt=""/>부서별조회</p></li>
                </ul>
              :
              <ul className="sidenav">
                <li><p onClick={this.Logout}><img src={userPng} alt=""/>로그아웃</p></li>
                <li><p onClick={this.isTimeLog}><img src={filePng} alt=""/>근태기록</p></li>
              </ul>
            :
            <ul className="sidenav">
              <li><p onClick={this.isLogin}><img src={userPng} alt=""/>로그인</p></li>
            </ul>
          }
        </div>
        <div className="main">
          {isLogin ?
            <form action="" method="post">
              <div className="container">
                <label><b>사원번호</b></label>
                <input type="text" value={this.state.id} onChange={this.handleChange} placeholder="사원번호를 입력해주세요." />
                <label><b>비밀번호</b></label>
                <input type="password" value={this.state.pw} onChange={this.pwChange} placeholder="비밀번호를 입력해주세요." />
                <button type="submit" onClick={this.pushLogin}>로그인</button>
              </div>
            </form>
            : isTimeLog ?
              <div>
                <p className="title">{this.state.name}님 반갑습니다.</p>
                <table>
                  <tr>
                    <th className="tb_width">사원번호</th>
                    <th className="tb_width">날짜</th>
                    <th className="tb_width">시간</th>
                    <th className="tb_width">분류</th>
                  </tr>
                </table>
                {Timelogs.map(timelog => (
                  <TimeLog
                    id={this.state.id}
                    date={timelog.date}
                    time={timelog.time}
                    type={timelog.type} />
                ))}
                <p>이번 주 총 근무시긴은 {this.state.total}분 입니다.</p>
              </div>
              :
              <div>
                <p>관리자님 반갑습니다.</p>
                <table>
                  <tr>
                    <th className="tb_width">부서</th>
                    <th className="tb_width">사원번호</th>
                    <th className="tb_width">이름</th>
                    <th className="tb_width">근무시간</th>
                  </tr>
                </table>
                {FinalResultArr.map(FinalResultArr => (
                  <Admin
                    dept={FinalResultArr.FinDept}
                    id={FinalResultArr.FinNum}
                    name={FinalResultArr.FinName}
                    total={FinalResultArr.FinTotalTime}
                  />
                ))}
                <p>10/14(월)~10/16(수) {this.state.dept}팀의 조회 내역입니다.</p>
              </div>
          }
        </div>
      </div>
    );
  }
}


export default App;
