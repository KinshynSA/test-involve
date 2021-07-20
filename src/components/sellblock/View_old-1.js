import {useState, useEffect, useReducer} from 'react';

import {get, post} from '../../util/actions.js';
import Selector from '../selector/View.js';


export default function SellBlock(props){
	const [paymentMethods, setPaymentMethods] = useState({invoice: [], withdraw: []})
	const [methodSell, setMethodSell] = useState(null)
	const [methodBuy, setMethodBuy] = useState(null)

	const [state, dispatch] = useReducer(reducer, {
		valueSell: null,
		valueBuy: null,
		loadValues: false,
	})

	function reducer(state,action){
		console.log('t1',action)
		switch(action.type){
			case 'setInvoice':
				return {...state, valueSell: action.value}
			case 'loadInvoice':
				return {...state, valueBuy: action.value}
			case 'loadWithdraw':
				return {...state, valueBuy: action.value}
			case 'setWithdraw':
				return {...state, valueSell: action.value}
			default:
				console.log('error')
		}
	}

	function dispatchWrapper(action){	
		switch(action.type){
			case 'invoice':
				dispatch({value: action.value, type: 'setInvoice'})
				break;
			case 'withdraw':
				dispatch({value: action.value, type: 'setWithdraw'})
				break;			
		}

		changeValue(action.value,action.type).then(res => {
			console.log('t0',state,action)
			switch(action.type){
				case 'invoice':
					if(state.valueSell !== action.value) return;
					break;
				case 'withdraw':
					if(state.valueBuy !== action.value) return;
					dispatch({type: 'loadInvoice', value: res})
					break;
			}
		})
	}

	async function changeValue(amount, base){
		return await get('/payMethods/calculate', {
			base: base,
			amount: amount,
			invoicePayMethod: methodSell.id,
			withdrawPayMethod: methodBuy.id,
		}).then(result => result.amount)
	}

	useEffect(() => {
		get('/payMethods')
			.then(result => {
				console.log(result)
				setPaymentMethods(result)
				setMethodSell(result.invoice[0])
				setMethodBuy(result.withdraw[0])
			})
	}, [])

	useEffect(() => {
		if(!state.valueSell) return;
		//changeValue(valueSell, 'invoice')
	}, [methodSell])

	useEffect(() => {
		if(!state.valueBuy) return;
		//changeValue(valueBuy, 'withdraw')
	}, [methodBuy])

	return(
		<div className="main-block sell_block">
			<div className="sell_column">
				<p className="sell_column_title">Sell</p>
				<Selector options={paymentMethods.invoice} selected={methodSell} onChange={setMethodSell} disabled={state.loadValues} />
				<div className={`sell_column_field ${state.loadValues ? 'loading' : ''}`}>
					<input type="text" value={state.valueSell ? state.valueSell : ''} onChange={(e) => dispatchWrapper({value: e.target.value, type: 'invoice'})} />
				</div>
			</div>
			<div className="sell_column">
				<p className="sell_column_title">Buy</p>
				<Selector options={paymentMethods.withdraw} selected={methodBuy} onChange={setMethodBuy} disabled={state.loadValues} />
				<div className={`sell_column_field ${state.loadValues ? 'loading' : ''}`}>
					<input type="text" value={state.valueBuy ? state.valueBuy : ''} onChange={(e) => dispatch({value: e.target.value, type: 'withdraw'})} />
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