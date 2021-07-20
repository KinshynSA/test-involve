import {useState, useEffect, useReducer} from 'react';

import {get, post} from '../../util/actions.js';
import Selector from '../selector/View.js';


export default function SellBlock(props){
    const [controller, setController] = useState(new AbortController())    
	const [paymentMethods, setPaymentMethods] = useState({invoice: [], withdraw: []})
	const [methodSell, setMethodSell] = useState(null)
	const [methodBuy, setMethodBuy] = useState(null)
    const [valueSell, setValueSell] = useState('')
    const [valueBuy, setValueBuy] = useState('')
    const [loadingSell, setLoadingSell] = useState(false)
    const [loadingBuy, setLoadingBuy] = useState(false)

	useEffect(() => {
		get('/payMethods')
			.then(result => {
				setPaymentMethods(result)
				setMethodSell(result.invoice[0])
				setMethodBuy(result.withdraw[0])
			}).catch(error => {
                console.log(error)
            })
	}, [])

    useEffect(() => {  
        if(!loadingBuy) return;
        loadField({
            base: 'invoice',
            amount: +valueSell,
        })
    }, [valueSell])

    useEffect(() => {  
        if(!loadingSell) return;
        loadField({
            base: 'withdraw',
            amount: +valueBuy,
        })
    }, [valueBuy])

    function changeField(value, type){
        value = value.replace(/[^\d;]/g, '')
        if(value === '') return;
        console.log('value',value)

        if(type){
            setValueSell(value)
            setLoadingBuy(true)
        } else {
            setValueBuy(value)
            setLoadingSell(true)
        }
    }

    function loadField(p = {}){
        controller.abort();
        let c = new AbortController()
        setController(c)

        get('/payMethods/calculate', {
            invoicePayMethod: methodSell.id,
            withdrawPayMethod: methodBuy.id,
            ...p
        }, c).then((res) => {
            console.log('t2',p.amount)
            if(p.base === 'invoice'){
                setLoadingBuy(false)
                setValueBuy(res.amount)
            } else {
                setLoadingSell(false)
                setValueSell(res.amount)
            }
        }).catch(error => {
            if(error.name !== 'AbortError') console.log(error)            
        })
    }

	return(
		<div className="main-block sell_block">
			<div className="sell_column">
				<p className="sell_column_title">Sell</p>
				<Selector options={paymentMethods.invoice} selected={methodSell} onChange={setMethodSell} />
				<div className={`sell_column_field${loadingSell ? ' loading' : ''}`}>
					<input type="text" value={valueSell} onChange={(e) => changeField(e.target.value, true)} />
				</div>
			</div>
			<div className="sell_column">
				<p className="sell_column_title">Buy</p>
				<Selector options={paymentMethods.withdraw} selected={methodBuy} onChange={setMethodBuy} />
				<div className={`sell_column_field${loadingBuy ? ' loading' : ''}`}>
					<input type="text" value={valueBuy} onChange={(e) => changeField(e.target.value, false)} />
				</div>
			</div>
			<div className="sell_column sell_column-full">
				<div className="button_container">
					<button className="button">Exchange</button>
				</div>
			</div>
		</div>
	)
}