import {useState} from 'react';

export default function Selector(props){
	const [c,setC] = useState('')

	return(
		<div className={`selector_container ${c}`} tabIndex="1" onBlur={() => setC('')}>
			<div className="selector_label" onClick={() => {
				if(props.disabled) return;
				c ? setC('') : setC('active')
			}}>
				<span className="selector_label_text">{props.selected ? props.selected.name : props.options[0] ? props.options[0].name : ''}</span>
				<div className="selector_label_arrow">
					<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M5 6L0 0L10 9.08524e-07L5 6Z" fill="#3A3A3A" />
					</svg>
				</div>
			</div>
			<div className="selector_list">
				{props.options.map((o,i) => {
					return (
						<div
							className="selector_list_item"
							onClick={() => {
								if(props.disabled) return;
								props.onChange(o)
								setC('')
							}}
							key={`selector_list_item-${o.id}`}>{o.name}</div>
					)
				})}
			</div>
		</div>
	)
}