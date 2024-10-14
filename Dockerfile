FROM denoland/deno:2.0.0 AS base

# The port that your application listens to.
EXPOSE 8000

WORKDIR /app
RUN chown -R deno:deno /app

FROM base AS build
# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY .  .
RUN deno install
RUN deno compile --allow-read --allow-net --allow-env hono.ts


# These steps will be re-run upon each file change in your working directory:
##COPY . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
#RUN deno cache hono.ts
#RUN deno compile --allow-read --allow-net --allow-env hono.ts

FROM build AS final
COPY --from=build /app/hono.ts /app/hono.ts
CMD [ "./hono" ]