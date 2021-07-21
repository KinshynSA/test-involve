export default function PageSecond(props){
    function cancel(){
        props.setState({...props.state, page: 1})
    }

	return(
		<div className={`sell_block${props.loadingMain ? ' sell_block-loading' : ''} sell_block-min`}>
			<div className="sell_column sell_column-full">
				<p className="sell_column_title">Details</p>
                <div className="sell_rows">
                    <div className="sell_row">
                        <span className="sell_row_left">Sell</span>
                        <span className="sell_row_right">{props.state.valueSell} {props.state.methodSell.name}</span>
                    </div>
                    <div className="sell_row">
                        <span className="sell_row_left">Buy</span>
                        <span className="sell_row_right">{props.state.valueBuy} {props.state.methodBuy.name}</span>
                    </div>
                </div>
				<div className="button_container button_container-grid">
                    <button className="button button-white" onClick={cancel}>Cancel</button>
                    <button className="button" onClick={props.submit}>Confirm</button>				
				</div>
			</div>
		</div>
	)
}