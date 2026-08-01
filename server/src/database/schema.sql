CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    profile_picture TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE repositories (

    repo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    repository_name VARCHAR(255) NOT NULL,

    repository_type VARCHAR(20) NOT NULL,

    github_url TEXT,

    upload_path TEXT,

    branch_name VARCHAR(100),

    status VARCHAR(30) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_repository_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE repository_files (

    file_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    repo_id UUID NOT NULL,

    file_name VARCHAR(255) NOT NULL,

    file_path TEXT NOT NULL,

    file_extension VARCHAR(20),

    language VARCHAR(100),

    size BIGINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_repository_file
        FOREIGN KEY(repo_id)
        REFERENCES repositories(repo_id)
        ON DELETE CASCADE
);

CREATE TABLE analysis_reports (

    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    repo_id UUID NOT NULL,

    analysis_version INTEGER NOT NULL,

    project_summary TEXT,

    technology_stack JSONB,

    architecture JSONB,

    dependency_graph JSONB,

    repository_health DECIMAL(5,2),

    complexity_score DECIMAL(5,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_analysis_repository
        FOREIGN KEY(repo_id)
        REFERENCES repositories(repo_id)
        ON DELETE CASCADE
);

CREATE TABLE documentation (

    doc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    report_id UUID NOT NULL,

    readme TEXT,

    api_documentation TEXT,

    installation_guide TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_documentation_report
        FOREIGN KEY(report_id)
        REFERENCES analysis_reports(report_id)
        ON DELETE CASCADE
);

CREATE TABLE chat_history (

    chat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    report_id UUID NOT NULL,

    question TEXT NOT NULL,

    answer TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_chat_report
        FOREIGN KEY(report_id)
        REFERENCES analysis_reports(report_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_repository_user
ON repositories(user_id);

CREATE INDEX idx_files_repository
ON repository_files(repo_id);

CREATE INDEX idx_analysis_repository
ON analysis_reports(repo_id);

CREATE INDEX idx_chat_report
ON chat_history(report_id);

