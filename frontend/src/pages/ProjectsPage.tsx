import React, { useEffect, useState } from 'react'
import Chat from '../components/chat/Chat'
import TeamCard from '../components/TeamCard'
import ChartsContainer from '../components/charts/ChartsContainer'
import Back from '../assets/Back'
import { useNavigate } from 'react-router-dom'
import { projectAuthStore, userAuthStore } from '../authStore'

type TeamsCardProps = {
  team_description: string
  team_id: number
  team_name: string
  team_private: boolean
}

const ProjectPage: React.FC = () => {
  const [dataTeams, setDataTeams] = useState<TeamsCardProps[]>([])
  const token_project = projectAuthStore.getState().token
  const token_user = userAuthStore.getState().token
  const [newTeamData, setNewTeamData] = useState({
    team_name: '',
    team_description: '',
    team_password: '',
  })
  const [showCreateTeamPopup, setShowCreateTeamPopup] = useState(false)

  const navigate = useNavigate()

  const fetchTeams = async () => {
    console.log(token_project)
    console.log(token_user)
    try {
      const response = await fetch(
        `http://localhost:8000/project/${token_project}/teams`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token_user}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Error fetching teams')
      }

      const data = await response.json()
      setDataTeams(data)
    } catch (error) {
      console.error('Error:', error)
      console.log('An error occurred while fetching teams.')
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [token_project, token_user])

  const createNewTeam = async () => {
    console.log(newTeamData)
    const url = `http://localhost:8000/team/create?project_auth_key=${token_project}&team_name=${newTeamData.team_name}&team_description=${newTeamData.team_description}&team_password=${newTeamData.team_password}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token_user}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Error creating team')
      }

      fetchTeams()
      setShowCreateTeamPopup(false)
    } catch (error) {
      console.error('Error:', error)
      console.log('An error occurred while creating team.')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 58px)',
        marginTop: '58px',
      }}>
      <div
        style={{ flex: '0.7', backgroundColor: '#21252b', overflowY: 'auto' }}>
        <div className="d-flex align-items-center">
          <div className="m-2">
            <button
              className="btn p-0"
              onClick={() => navigate('/project-options')}>
              <Back size="36" color="#ffffff" />
            </button>
          </div>
          <div className="w-100 mt-2 mb-2 me-2 text-center">
            <span className="text-white p-0">
              Volver a la página de opciones
            </span>
          </div>
        </div>
        <hr className="border-top b-0 p-0 m-0 ms-2 me-2" />
        <ul
          className="p-2 m-2 mt-2"
          style={{
            listStyle: 'none',
            padding: 0,
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 140px)',
          }}>
          <li className="mb-3 align-item-center align-content-center">
            <button
              className="btn text-white w-100 mb-3"
              style={{ backgroundColor: '#5864f2' }}
              onClick={() => setShowCreateTeamPopup(true)}>
              Crear equipo
            </button>
          </li>
          {dataTeams.map((team: TeamsCardProps, index: number) => (
            <li className="mb-3" key={index}>
              <TeamCard team={team} />
            </li>
          ))}
        </ul>
      </div>
      {showCreateTeamPopup && (
        <div
          className="popup"
          style={{
            flex: '3',
            backgroundColor: '#282c34',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
          }}>
          <div
            className="p-2 text-white d-flex  "
            style={{ backgroundColor: '#F9F9F9' }}>
            <input
              type="text"
              value={newTeamData.team_name}
              onChange={(e) =>
                setNewTeamData({ ...newTeamData, team_name: e.target.value })
              }
              placeholder="Nombre del equipo"
            />
            <input
              type="text"
              value={newTeamData.team_description}
              onChange={(e) =>
                setNewTeamData({
                  ...newTeamData,
                  team_description: e.target.value,
                })
              }
              placeholder="Descripción del equipo"
            />
            <input
              type="password"
              value={newTeamData.team_password}
              onChange={(e) =>
                setNewTeamData({
                  ...newTeamData,
                  team_password: e.target.value,
                })
              }
              placeholder="Contraseña del equipo"
            />
            <button onClick={createNewTeam}>Crear equipo</button>
          </div>
        </div>
      )}
      <div
        style={{
          flex: '3',
          backgroundColor: '#282c34',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <div className="p-2 text-white " style={{ flex: '1' }}>
          <ChartsContainer />
        </div>
        <div className="p-2 text-white " style={{ flex: '1' }}>
          <Chat />
        </div>
      </div>
    </div>
  )
}

export default ProjectPage
