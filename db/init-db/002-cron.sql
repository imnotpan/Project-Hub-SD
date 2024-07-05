CREATE EXTENSION pg_cron;

CREATE OR REPLACE FUNCTION delete_old_messages() RETURNS void AS $$
BEGIN
    DELETE FROM chat_message
    WHERE timestamp < NOW() - INTERVAL '1 month';
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION delete_old_logs() RETURNS void AS $$
BEGIN
    DELETE FROM log
    WHERE log_creation_date < NOW() - INTERVAL '1 month';
END;
$$ LANGUAGE plpgsql;


SELECT cron.schedule('delete_old_messages', '0 0 1 * *', 'SELECT delete_old_messages();');
SELECT cron.schedule('delete_old_logs', '0 0 1 * *', 'SELECT delete_old_logs();');