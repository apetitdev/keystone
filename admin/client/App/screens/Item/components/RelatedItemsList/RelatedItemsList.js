import React from 'react';
import { Link } from 'react-router';
import { Alert, BlankState, Center, Spinner, Button, Form, Modal } from '../../../../elemental';

import DragDrop from './RelatedItemsListDragDrop';
import ListRow from './RelatedItemsListRow';
import EditForm from '../EditForm';

import { loadRelationshipItemData } from '../../actions';
import { TABLE_CONTROL_COLUMN_WIDTH } from '../../../../../constants';

const RelatedItemsList = React.createClass({
	propTypes: {
		onCancel: React.PropTypes.func,
		dispatch: React.PropTypes.func.isRequired,
		dragNewSortOrder: React.PropTypes.number,
		items: React.PropTypes.array,
		list: React.PropTypes.object.isRequired,
		refList: React.PropTypes.object.isRequired,
		relatedItemId: React.PropTypes.string.isRequired,
		relationship: React.PropTypes.object.isRequired,
	},
	getInitialState () {
		return {
			columns: this.getColumns(),
			err: null,
			items: null,
			isOpen: false
		};
	},
	componentDidMount () {
		this.__isMounted = true;
		this.loadItems();
	},
	componentWillUnmount () {
		this.__isMounted = false;
	},
	isSortable () {
		// Check if the related items should be sortable. The referenced list has to
		//   be sortable and it has to set the current list as it's sortContext.
		const { refList, list, relationship } = this.props;
		const sortContext = refList.sortContext;
		if (refList.sortable && sortContext) {
			const parts = sortContext.split(':');
			if (parts[0] === list.key && parts[1] === relationship.path) {
				return true;
			}
		}
		return false;
	},
	openPopup () {
		this.setState({isOpen: true})
	},
	handleClose() {
		this.setState({isOpen: false});
		debugger;
		this.props.onCancel();
	},
	getColumns () {
		const { relationship, refList } = this.props;
		const columns = refList.expandColumns(refList.defaultColumns);
		return columns.filter(i => i.path !== relationship.refPath);
	},
	loadItems () {
		const { refList, relatedItemId, relationship } = this.props;
		const { columns } = this.state;
		// TODO: Move error to redux store
		if (!refList.fields[relationship.refPath]) {
			const err = (
				<Alert color="danger">
					<strong>Error:</strong> Related List <strong>{refList.label}</strong> has no field <strong>{relationship.refPath}</strong>
				</Alert>
			);
			return this.setState({ err });
		}
		this.props.dispatch(loadRelationshipItemData({ columns, refList, relatedItemId, relationship }));
	},
	// THIS IS WHERE WE HAVE TO LOAD THE EDIT WITH POPUP ON CLICK
	renderItems () {
		const tableBody = (this.isSortable()) ? (
			<DragDrop
				columns={this.state.columns}
				items={this.props.items}
				{...this.props}
			/>
		) : (
			<tbody>
				{this.props.items.results.map((item) => {
					console.log('Got one item');
					console.log(item);
					console.log('Got this crap');
					console.log(this.props);
					return ([<ListRow
						key={item.id}
						columns={this.state.columns}
						item={item}
						refList={this.props.refList}
					/>, 
					<Button
						variant="link"
						color="success"
						data-button-type="cancel"
						onClick={this.openPopup}
					> Edit
					</Button>,
					<Modal.Dialog isOpen={this.state.isOpen} onClose={this.handleClose} backdropClosesModal>
						Je suis une loutre de compassion.
						<EditForm
							list={this.props.currentList}
							data={this.props.data}
							dispatch={this.props.dispatch}
							router={this.context.router}
							/>
					</Modal.Dialog>]);
				})}
			</tbody>
		);
		return this.props.items.results.length ? (
			<div className="ItemList-wrapper">
				<table cellPadding="0" cellSpacing="0" className="Table ItemList">
					{this.renderTableCols()}
					{this.renderTableHeaders()}
					{tableBody}
				</table>
			</div>
		) : (
			<BlankState
				heading={`No related ${this.props.refList.plural.toLowerCase()}...`}
				style={{ marginBottom: '3em' }}
			/>
		);
	},
	renderTableCols () {
		const cols = this.state.columns.map((col) => <col width={col.width} key={col.path} />);
		return <colgroup>{cols}</colgroup>;
	},
	renderTableHeaders () {
		const cells = this.state.columns.map((col) => {
			return <th key={col.path}>{col.label}</th>;
		});

		// add sort col when available
		if (this.isSortable()) {
			cells.unshift(
				<th width={TABLE_CONTROL_COLUMN_WIDTH} key="sortable" />
			);
		}

		return <thead><tr>{cells}</tr></thead>;
	},
	render () {
		if (this.state.err) {
			return <div className="Relationship">{this.state.err}</div>;
		}

		const listHref = `${Keystone.adminPath}/${this.props.refList.path}`;
		const loadingElement = (
			<Center height={100}>
				<Spinner />
			</Center>
		);

		return (
			<div className="Relationship">
				<h3 className="Relationship__link"><Link to={listHref}>{this.props.refList.label}</Link></h3>
				{this.props.items ? this.renderItems() : loadingElement}
			</div>
		);
	},
});


module.exports = RelatedItemsList;
