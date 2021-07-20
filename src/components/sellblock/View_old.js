import {useState, useEffect} from 'react';

import {get, post} from '../../util/actions.js';
import Selector from '../selector/View.js';


export default function SellBlock(props){
	const [paymentMethods, setPaymentMethods] = useState({invoice: [], withdraw: []})
	const [methodSell, setMethodSell] = useState(null)
	const [methodBuy, setMethodBuy] = useState(null)
	const [valueSell, setValueSell] = useState(undefined)
	const [valueBuy, setValueBuy] = useState(undefined)
	const [loadValues, setLoadValues] = useState(false)

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
		if(!valueSell) return;
		changeValue(valueSell, 'invoice')
	}, [methodSell])

	useEffect(() => {
		if(!valueBuy) return;
		changeValue(valueBuy, 'withdraw')
	}, [methodBuy])
	
	useEffect(() => {
		if(!methodSell || !methodBuy || loadValues) return;
		changeValue(valueSell, 'invoice')
	}, [valueSell])

	useEffect(() => {
		if(!methodSell || !methodBuy || loadValues) return;
		changeValue(valueBuy, 'withdraw')
	}, [valueBuy])

	function changeValue(amount, base){
		let value = amount;
		setLoadValues(true)

		get('/payMethods/calculate', {
			base: base,
			amount: amount,
			invoicePayMethod: methodSell.id,
			withdrawPayMethod: methodBuy.id,
		}).then(result => {

			if(base === 'invoice'){
				if(valueSell !== value) return;
				setValueBuy(result.amount)
			}

			if(base === 'withdraw'){
				if(valueBuy !== value) return;
				setValueSell(result.amount)
			}

			setLoadValues(false)
		})
	}

	return(
		<div className="main-block sell_block">
			<div className="sell_column">
				<p className="sell_column_title">Sell</p>
				<Selector options={paymentMethods.invoice} selected={methodSell} onChange={setMethodSell} disabled={loadValues} />
				<div className={`sell_column_field ${loadValues ? 'loading' : ''}`}>
					<input type="text" value={valueSell ? valueSell : ''} onChange={(e) => setValueSell(e.target.value)} />
				</div>
			</div>
			<div className="sell_column">
				<p className="sell_column_title">Buy</p>
				<Selector options={paymentMethods.withdraw} selected={methodBuy} onChange={setMethodBuy} disabled={loadValues} />
				<div className={`sell_column_field ${loadValues ? 'loading' : ''}`}>
					<input type="text" value={valueBuy ? valueBuy : ''} onChange={(e) => setValueBuy(e.target.value)} />
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