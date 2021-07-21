import {useState, useEffect} from 'react';

import {get} from '../../util/actions.js';
import Selector from '../selector/View.js';


export default function PageFirst(props){
    const [controller, setController] = useState(new AbortController())   
	const [methodSell, setMethodSell] = useState(props.methodSell)
	const [methodBuy, setMethodBuy] = useState(props.methodBuy)
    const [valueSell, setValueSell] = useState(props.valueSell ?? '')
    const [valueBuy, setValueBuy] = useState(props.valueBuy ?? '')
    const [loadingSell, setLoadingSell] = useState(false)
    const [loadingBuy, setLoadingBuy] = useState(false)
    const [base, setBase] = useState(props.base)
    const [error, setError] = useState()

    useEffect(() => {
        if(!methodSell) setMethodSell(props.paymentMethods.invoice[0])
        if(!methodBuy) setMethodBuy(props.paymentMethods.withdraw[0])
    }, [props.paymentMethods])

    useEffect(() => {  
        if(!loadingBuy || valueSell === '') return;
        loadField({
            amount: +valueSell,
        })
    }, [valueSell, methodSell])

    useEffect(() => {  
        if(!loadingSell || valueBuy === '') return;
        loadField({
            amount: +valueBuy,
        })
    }, [valueBuy, methodBuy])

    function changeSelect(o, type){
        if(type){
            if(valueSell !== ''){
                setBase('invoice')
                setLoadingBuy(true)
            }
            setMethodSell(o)
        } else {
            if(valueBuy !== ''){
                setBase('withdraw')
                setLoadingSell(true)                
            }
            setMethodBuy(o)
        }
    }

    function changeField(value, type){
        value = value.replace(/[^\d;\.]/g, '')
        if(value === '') value = 0;

        if(type){
            setBase('invoice')
            setValueSell(value)
            setLoadingBuy(true)
        } else {
            setBase('withdraw')
            setValueBuy(value)
            setLoadingSell(true)
        }
    }

    function loadField(p = {}){
        controller.abort();
        let c = new AbortController()
        setController(c)
        setError(null)

        get('/payMethods/calculate', {
            invoicePayMethod: methodSell.id,
            withdrawPayMethod: methodBuy.id,
            amount: p.amount,
            base,
        }, c).then((res) => {
            if(base === 'invoice'){
                setLoadingBuy(false)
                setValueBuy(res.amount)
            } else {
                setLoadingSell(false)
                setValueSell(res.amount)
            }
        }).catch(err => {
            if(err.name !== 'AbortError'){
                setError(err.toString())
                console.log(err)
            }             
        })
    }

    function exchange(){
        if(valueBuy && valueSell){
            props.setState({
                page: 2,
                base,
                valueSell,
                valueBuy,
                methodSell,
                methodBuy,
            })
        }
    }

	return(
		<div className={`sell_block${props.loadingMain ? ' sell_block-loading' : ''}`}>
			<div className="sell_column">
				<p className="sell_column_title">Sell</p>
				<Selector options={props.paymentMethods.invoice} disabled={loadingSell} selected={methodSell} onChange={(o) => changeSelect(o,true)} />
				<div className={`sell_column_field${loadingSell ? ' loading' : ''}`}>
					<input type="text" value={valueSell} disabled={loadingSell} onChange={(e) => changeField(e.target.value, true)} />
				</div>
			</div>
			<div className="sell_column">
				<p className="sell_column_title">Buy</p>
				<Selector options={props.paymentMethods.withdraw} disabled={loadingBuy} selected={methodBuy} onChange={(o) => changeSelect(o,false)} />
				<div className={`sell_column_field${loadingBuy ? ' loading' : ''}`}>
					<input type="text" value={valueBuy} disabled={loadingBuy} onChange={(e) => changeField(e.target.value, false)} />
				</div>
			</div>
			<div className="sell_column sell_column-full">
				<div className="button_container">
                    {(props.loadingMain || loadingBuy || loadingSell) ? (
                        <button disabled={true} className="button button-loading">Exchange</button>
                    ) : (
                        <button className="button" onClick={exchange}>Exchange</button>
                    )}					
				</div>
			</div>
            {error && <span className="error tac">{error}</span>}
		</div>
	)
}