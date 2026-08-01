CREATE TABLE repository_files (
    file_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id UUID NOT NULL REFERENCES repositories(repo_id) ON DELETE CASCADE,

    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(20) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);