/**
 * Edit tile.
 * @module components/manage/Tiles/Tile/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

import {
  EditTitleTile,
  EditDescriptionTile,
  EditTextTile,
  EditImageTile,
  EditVideoTile,
} from '../../../';

const itemSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const ItemTypes = {
  ITEM: 'tile',
};

const itemTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.onMoveTile(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

@DropTarget(ItemTypes.ITEM, itemTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.ITEM, itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
}))
/**
 * Edit tile class.
 * @class Edit
 * @extends Component
 */
export default class Edit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    type: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    onMoveTile: PropTypes.func.isRequired,
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const {
      type,
      selected,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
    } = this.props;

    let Tile = null;
    switch (type) {
      case 'title':
        Tile = EditTitleTile;
        break;
      case 'description':
        Tile = EditDescriptionTile;
        break;
      case 'text':
        Tile = EditTextTile;
        break;
      case 'image':
        Tile = EditImageTile;
        break;
      case 'video':
        Tile = EditVideoTile;
        break;
      default:
        break;
    }
    const hideHandler =
      this.props.data['@type'] === 'text' &&
      this.props.data.text &&
      this.props.data.text.data === '<p><br></p>';
    return connectDropTarget(
      connectDragPreview(
        <div className={`ui drag tile inner ${type}`}>
          {selected &&
            connectDragSource(
              <div
                className={
                  hideHandler
                    ? 'drag handle wrapper hidden'
                    : 'drag handle wrapper'
                }
              >
                <Icon className="drag handle" name="content" size="large" />
              </div>,
            )}
          {Tile !== null ? <Tile {...this.props} /> : <div />}
        </div>,
      ),
    );
  }
}
