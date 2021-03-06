import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNode, useEditor } from '@craftjs/core';
import styled from '@emotion/styled';

import ArrowUp from '@material-ui/icons/ArrowUpward';
import Move from '@material-ui/icons/OpenWith';
import Delete from '@material-ui/icons/Delete';
import ReactDOM from 'react-dom';
import { ROOT_NODE } from '@craftjs/utils';
import { AppState } from '../../types';

const IndicatorDiv = styled.div`
  height: 30px;
  margin-top: -29px;
  font-size: 12px;
  line-height: 12px;

  svg {
    fill: #fff;
    width: 15px;
    height: 15px;
  }
`;

const Btn = styled.a`
  padding: 0 0px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  > div {
    position: relative;
    top: -50%;
    left: -50%;
  }
`;

export const RenderNode = ({ render }) => {
    const { actions, query, connectors } = useEditor();
    const {
        id,
        isActive,
        isHover,
        dom,
        name,
        moveable,
        deletable,
        connectors: { drag },
        parent,
    } = useNode((node) => ({
        isActive: node.events.selected,
        isHover: node.events.hovered,
        dom: node.dom,
        name: node.data.custom.displayName || node.data.displayName,
        moveable: query.node(node.id).isDraggable(),
        deletable: query.node(node.id).isDeletable(),
        parent: node.data.parent,
        props: node.data.props,
    }));

    const currentRef = useRef<HTMLDivElement>(null);
    const editorOpened = useSelector((state: AppState) => state.editorOpened);

    useEffect(() => {
        if (dom) {
            dom.classList.add('border', 'border-dashed');
            if (editorOpened && (isActive || isHover)) {
                dom.classList.add('border-primary');
                dom.classList.remove('border-transparent');
            } else { 
                dom.classList.add('border-transparent');
                dom.classList.remove('border-primary');
            }
        }
    }, [dom, isActive, isHover, editorOpened]);

    const getPos = useCallback((dom: HTMLElement) => {
        const { top, left, bottom } = dom
            ? dom.getBoundingClientRect()
            : { top: 0, left: 0, bottom: 0 };
        return {
            top: `${top > 0 ? top : bottom}px`,
            left: `${left}px`,
        };
    }, []);

    const scroll = useCallback(() => {
        const { current: currentDOM } = currentRef;

        if (!currentDOM) return;
        const { top, left } = getPos(dom!);
        currentDOM.style.top = top;
        currentDOM.style.left = left;
    }, [dom]);

    useEffect(() => {
        document
            .querySelector('.craftjs-renderer')
            ?.addEventListener('scroll', scroll);

        return () => {
            document
                .querySelector('.craftjs-renderer')
                ?.removeEventListener('scroll', scroll);
        };
    }, [scroll]);

    console.log("RenderNode:", getPos(dom!).left, getPos(dom!).top, isHover, isActive, dom, editorOpened);

    return (
        <>
            {editorOpened && (isHover || isActive)
                ? ReactDOM.createPortal(
                    <IndicatorDiv
                        id="IndicatorDiv"
                        ref={currentRef}
                        className="px-2 py-2 text-white bg-primary position-fixed d-flex align-items-center border border-primary border-dashed"
                        style={{
                            left: getPos(dom!).left,
                            top: getPos(dom!).top,
                            zIndex: 9999,
                            fontSize: "15px",
                        }}
                    >
                        <span className="flex-1 mr-4">{name}</span>
                        {moveable ? (
                            //@ts-ignore
                            <Btn className="mr-2 cursor-move" ref={drag}>
                                <Move />
                            </Btn>
                        ) : null}
                        {id !== ROOT_NODE && (
                            <Btn
                                className="mr-2 cursor-pointer"
                                onClick={() => {
                                    actions.selectNode(parent);
                                }}
                            >
                                <ArrowUp />
                            </Btn>
                        )}
                        {deletable ? (
                            <Btn
                                className="cursor-pointer"
                                onMouseDown={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    actions.delete(id);
                                }}
                            >
                                <Delete />
                            </Btn>
                        ) : null}
                    </IndicatorDiv>,
                    document.body
                )
                : null}
            {render}
        </>
    );
};
