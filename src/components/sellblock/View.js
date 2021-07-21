import {useState, useEffect, Fragment} from 'react';

import {get, post} from '../../util/actions.js';
import PageFirst from './Pagefirst';
import PageSecond from './Pagesecond';
import PageThird from './Pagethird';


export default function SellBlock(props){
	const [paymentMethods, setPaymentMethods] = useState({invoice: [], withdraw: []}) 
    const [loadingMain, setLoadingMain] = useState(true)
    const [state, setState] = useState({
        page: 1,
    })

	useEffect(() => {
        setLoadingMain(true)
		get('/payMethods')
			.then(result => {
				setPaymentMethods(result)
                setLoadingMain(false)
			}).catch(error => {
                console.log(error)
            })
	}, [])

    function submit(){
        setLoadingMain(true)
        post('/bids', {
            amount: state.base === 'invoice' ? +state.valueSell : +state.valueBuy,
            base: state.base,
            invoicePayMethod: state.methodSell.id,
            withdrawPayMethod: state.methodBuy.id,
        }).then(() => {
            setState({page: 3})
            setLoadingMain(false)
        }).catch(error => {
            console.log(error)
        })
    }

    return (
        <Fragment>
            {state.page === 1 && <PageFirst paymentMethods={paymentMethods} loadingMain={loadingMain} setState={setState} {...state} />}
            {state.page === 2 && <PageSecond loadingMain={loadingMain} setLoadingMain={setLoadingMain} setState={setState} state={state} submit={submit} />}
            {state.page === 3 && <PageThird />}
        </Fragment>
    )
}