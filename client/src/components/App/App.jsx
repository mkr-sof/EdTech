import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [userVotesCount, setUserVotesCount] = useState(0);
  const VOTE_LIMIT = 10;

  const BASE_URL = 'http://localhost:4000/api';

  async function featchIdeas(){
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/ideas`);
      const data = await res.json();
      setIdeas(data);
      setMessage(null);
      const initialVotes = data.filter(idea => idea.voted).length;
      setUserVotesCount(initialVotes);

    }catch(err){
      setMessage({type: 'error', text: 'Failed to load ideas.'});
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    featchIdeas();
  }, []);

  async function vote(ideaId){
    if (userVotesCount >= VOTE_LIMIT){
      setMessage({type: 'error', text: 'You have reached your voting limit.'});
      return;
    }
    setMessage(null);
    try{
      const res = await fetch(`${BASE_URL}/ideas/${ideaId}/vote`, { method: 'POST' });
      if (res.status === 200){
        setMessage({type: 'success', text: 'Vote recorded!'});
        setIdeas(prev => prev.map(idea => idea.id === ideaId 
          ? {...idea, voted: true, votes_count: (idea.votes_count ?? 0) + 1} 
          : idea
        ));
        setUserVotesCount(prev => prev + 1);
      }else if (res.status === 409){
        const body = await res.json();
        if (body.error === 'alredy_voted'){
          setMessage({type: 'error', text: 'You have already voted for this idea.'});
        }else if (body.error === 'vote_limit_exceeded'){
          setMessage({type: 'error', text: 'You have reached your voting limit.'});
        }else {
          setMessage({type: 'error', text: 'Failed to vote'});
        }
      }else {
        setMessage({type: 'error', text: 'Internal server error. Please try again later.'});
      }
    }catch(err){
      setMessage({type: 'error', text: 'Failed to vote. Please try again later.'})
    }
  }

  if (loading) return <div className='loading'>Loading...</div>
  return (
   <div>
    <div className='container'>
      <h1>Idea Vote App</h1>
      {message && (
          <div className={`message_${message.type}`}>
          {message.text}
          </div>
      )} 
      {ideas.length === 0 ? (
        <div>No ideas available.</div>
      ) : (
        <ul className='ideas_list'>
          {ideas.map(idea => (
            <li key={idea.id} className='idea_item'>
              <h2>{idea.title} <small>({idea.votes_count})</small></h2>
              <p>{idea.description}</p>
            <button
              disabled={idea.voted}
              onClick={() => vote(idea.id)}
            >
              {idea.voted ? 'Voted' : 'Vote'}
            </button>
            </li>
          ))}
        </ul>
      )}
    </div>
   </div>
  )
}

export default App
