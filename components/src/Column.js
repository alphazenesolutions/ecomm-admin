import React from "react";
import { Draggable } from "react-beautiful-dnd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Droppable } from "react-beautiful-dnd";

const Column = ({ column, tasks }) => {
  return (
    <div rounded="3px" bg="column-bg" w="400px" h="620px" flexDir="column">
      <div>
        <p className="mb-2 font-bold	">{column.title}</p>
      </div>

      <Droppable droppableId={column.id}>
        {(droppableProvided, droppableSnapshot) => (
          <div
            className="Home_sections_container"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                {(draggableProvided, draggableSnapshot) => (
                  <>
                    <div
                      className="Home_sections"
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <p>{task.content}</p>
                    </div>
                    <center>
                      {index != tasks.length - 1 && <MoreVertIcon />}
                    </center>
                  </>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
