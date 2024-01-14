import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name,setName] = useState('');
  const [datetime,setDatetime] = useState('');
  const [desc,setDesc] = useState('');
  const [transactions,setTransactions] = useState([]);
  useEffect(()=>{
    getTransactions().then(setTransactions) 
  },[]);

    async function getTransactions(){
      const url = process.env.REACT_APP_API_URL + '/transactions';
     const response = await fetch(url);
     const json = await response.json();
     return json;
    }

    function adddNewTransaction(ev){
      ev.preventDefault();
      const url = process.env.REACT_APP_API_URL + '/transaction';
      const price = name.split(' ')[0];
      fetch(url,{
        method: 'POST',
        headers: {'Content-type':'application/json'},
        body: JSON.stringify({
          price,
          name:name.substring(price.length+1),
          desc,
          datetime
        })
      }).then(res => {
        res.json().then(json=>{
          setName('');
          setDesc('');
          setDatetime('');
          console.log('result', json);
        });
      });
    }
     
    let bal =0;
    for(const transaction of transactions){
      bal=bal + transaction.price;
    }
    bal = bal.toFixed(2);
    const frac = bal.split('.')[1];
    bal = bal.split('.')[0];
  return (
    <main>
      <h1>${bal}<span>{frac}</span></h1>
      <form onSubmit={adddNewTransaction}>
      <div className='basics'>
        <input type='text' 
               value={name} 
               onChange={ev=>setName(ev.target.value)} 
               placeholder='+200 nwe samsung tv'
                required='true'
               />
        <input type='datetime-local' 
               value={datetime} 
               onChange={ev=>setDatetime(ev.target.value)} required='true'

               />
      </div>
        <div className='description'>
          <input type='text' 
                 value={desc} 
                 onChange={ev=>setDesc(ev.target.value)}
                 placeholder='description' required='true'
                  
                 />
        </div>
        <button type="submit">Add new transcation</button>
      </form>

      <div className='transactions'>
      {transactions.length>0 && transactions.map(transc => (
        <div className='transaction'>
          <div className='left'>
            <div className='name'>{transc.name}</div>
            <div className='description'>{transc.desc}</div>
          </div>
          <div className='right'>
            <div className={'price '+ (transc.price<0?'red':'green')}>{transc.price}</div>
            <div className='datetime'>{transc.datetime}</div>
          </div>
        </div>
      ))}
        
      </div>

    </main>
    
  );
}

export default App;
