FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y bash git curl

# Global npm prefix for the node user (fixes npm -g EACCES)
RUN mkdir -p /home/node/.npm-global \
  && chown -R node:node /home/node/.npm-global
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH

# Install Supabase CLI
RUN curl -fsSL "https://github.com/supabase/cli/releases/latest/download/supabase_linux_$(dpkg --print-architecture).tar.gz" \
  | tar -xz -C /usr/local/bin supabase \
  && chmod +x /usr/local/bin/supabase

WORKDIR /app

# Pre-create node_modules owned by node so the named volume mount
# inherits correct ownership and npm install never hits EACCES
RUN mkdir -p /app/node_modules \
  && chown -R node:node /app

# Install Claude Code globally as node user
USER node
RUN npm install -g @anthropic-ai/claude-code

CMD ["sleep", "infinity"]