-- =============================================================
-- Dump do banco de dados - Sistema de Blog (Case Mind Group)
-- Execute este script em um MySQL 8+ para criar o schema completo
-- =============================================================

CREATE DATABASE IF NOT EXISTS blog_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE blog_db;

-- ---------------------------------------------------------------
-- Tabela: users
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- Tabela: articles
-- banner_image guarda o caminho relativo do arquivo salvo em disco
-- (uploads/banners/<arquivo>). Alternativa: trocar por coluna BLOB
-- caso a imagem deva ser persistida diretamente no banco.
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS articles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content MEDIUMTEXT NOT NULL,
  banner_image VARCHAR(255) NULL,
  author_id INT UNSIGNED NOT NULL,
  published_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_articles_author
    FOREIGN KEY (author_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  KEY idx_articles_author (author_id),
  KEY idx_articles_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- Dados de exemplo (opcional - facilita a avaliação)
-- Senha em texto puro para os dois usuários abaixo: "123456"
-- Hash gerado com bcrypt (saltRounds = 10)
-- ---------------------------------------------------------------
INSERT INTO users (name, email, password_hash) VALUES
  ('Ana Souza', 'ana.souza@example.com', '$2b$10$DBVrY94v1WiGDhCaOtHq7eBmV4T3JJUB/ZYcQplmdHzfDxQtdk9sK'),
  ('Bruno Lima', 'bruno.lima@example.com', '$2b$10$DBVrY94v1WiGDhCaOtHq7eBmV4T3JJUB/ZYcQplmdHzfDxQtdk9sK')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO articles (title, content, banner_image, author_id) VALUES
  (
    'Bem-vindo ao nosso blog',
    'Este é o primeiro artigo de exemplo, criado para demonstrar o funcionamento do sistema de blog. Edite ou remova este conteúdo à vontade.',
    NULL,
    1
  ),
  (
    'Boas práticas de Clean Code',
    'Código limpo é aquele que qualquer pessoa da equipe consegue ler, entender e manter com facilidade. Nomes descritivos, funções pequenas e responsabilidade única são pilares essenciais.',
    NULL,
    2
  );
