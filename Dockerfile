FROM denoland/deno:2.0.0 AS base

# The port that your application listens to.
EXPOSE 8000

FROM base AS client
WORKDIR /usr/src/app
#RUN chown -R deno:deno /usr/src/app


#USER deno

COPY client/deno.lock .
COPY client/package.json .
COPY client/ .

RUN deno install
RUN deno task build



FROM base AS build
WORKDIR /app
#RUN chown -R deno:deno /app
# Prefer not to run as root.
#USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY .  .
RUN rm -rf client
RUN deno install
RUN deno compile --allow-read --allow-net --allow-env server.ts


# These steps will be re-run upon each file change in your working directory:
##COPY . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno task build
#RUN deno compile --allow-read --allow-net --allow-env hono.ts

FROM build AS final
COPY --from=build /app/server.ts /app/server.ts
COPY --from=client /usr/src/app/build /app/client/build
CMD [ "deno", "run", "--allow-read", "--allow-net", "--allow-env", "server.ts" ]