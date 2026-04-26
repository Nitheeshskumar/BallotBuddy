import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { CheckCircle, Vote } from 'lucide-react';

const SAMPLE_CONTEST = {
  id: 'president',
  title: 'President of the United States',
  candidates: [
    { id: 'c1', name: 'Candidate A', party: 'Party A' },
    { id: 'c2', name: 'Candidate B', party: 'Party B' },
    { id: 'c3', name: 'Candidate C', party: 'Independent' },
  ]
};

const BallotSimulator = ({ onProgressUpdate }) => {
  const [candidates, setCandidates] = useState(SAMPLE_CONTEST.candidates);
  const [votedId, setVotedId] = useState(null);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    // Check if dropped into the "Ballot Box" droppable area
    if (result.destination.droppableId === 'ballot-box') {
      setVotedId(result.draggableId);
      onProgressUpdate('ballot_simulated'); // Update Civic Quest progress
    }
  };

  const votedCandidate = candidates.find(c => c.id === votedId);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
        <Vote className="text-indigo-500" />
        Ballot Simulator
      </h2>
      <p className="text-slate-500 mb-6">Drag a candidate into the ballot box to practice voting.</p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Candidates List */}
          <div>
            <h3 className="font-semibold text-slate-700 mb-4">{SAMPLE_CONTEST.title}</h3>
            <Droppable droppableId="candidates-list" isDropDisabled={true}>
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {candidates.map((candidate, index) => (
                    <Draggable 
                      key={candidate.id} 
                      draggableId={candidate.id} 
                      index={index}
                      isDragDisabled={votedId !== null}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-4 rounded-xl border ${snapshot.isDragging ? 'bg-indigo-50 border-indigo-300 shadow-md' : 'bg-slate-50 border-slate-200'} ${votedId !== null ? 'opacity-50 cursor-not-allowed' : 'cursor-grab hover:border-indigo-300'} transition-all`}
                        >
                          <div className="font-medium text-slate-800">{candidate.name}</div>
                          <div className="text-sm text-slate-500">{candidate.party}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Ballot Box Area */}
          <div>
            <h3 className="font-semibold text-slate-700 mb-4">Your Ballot Box</h3>
            <Droppable droppableId="ballot-box">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`h-full min-h-[200px] border-2 border-dashed rounded-xl flex items-center justify-center p-6 transition-colors ${snapshot.isDraggingOver ? 'bg-green-50 border-green-400' : 'bg-slate-50 border-slate-300'}`}
                >
                  {votedCandidate ? (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                        <CheckCircle size={32} />
                      </div>
                      <h4 className="font-bold text-slate-800 text-lg">Vote Cast Successfully!</h4>
                      <p className="text-slate-600 mt-2">You voted for {votedCandidate.name}</p>
                      <button 
                        onClick={() => setVotedId(null)}
                        className="mt-6 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Reset Simulator
                      </button>
                    </motion.div>
                  ) : (
                    <div className="text-center text-slate-400">
                      <Vote size={48} className="mx-auto mb-3 opacity-50" />
                      <p>Drag a candidate here</p>
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default BallotSimulator;
