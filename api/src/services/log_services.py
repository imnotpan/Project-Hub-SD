import json
from datetime import datetime
import src.controllers.db_controller as db
from src.controllers.rabbit_controller import rabbit_controller 

async def add_log(detail, state, action, user_id = None):
    cursor = db.conn.cursor()
    log_in_db = f"""
        INSERT INTO log (log_detail, app_user_id, action_id, log_state )
        VALUES (%s, %s, %s, %s);
    """
    log_in_db_query_parameters = ( 
                            detail,
                            user_id,
                            action,
                            state
                            )
    cursor.execute(log_in_db,log_in_db_query_parameters)
    db.conn.commit()
    
    